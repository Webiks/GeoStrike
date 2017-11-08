import { Component, NgZone, OnInit } from '@angular/core';
import { CesiumService, GeoUtilsService, KeyboardControlParams, KeyboardControlService, } from 'angular-cesium';
import { CharacterService, MeModelState, ViewState, } from '../../../services/character.service';
import { environment } from '../../../../../environments/environment';
import { KeyboardKeysService } from '../../../../core/services/keyboard-keys.service';
import { GameService } from '../../../services/game.service';
import { CollisionDetectorService } from '../../../services/collision-detector.service';

const LookDirection = {
  Up: 'ArrowUp',
  Down: 'ArrowDown',
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
};

const LookDirectionsDelta = {
  [LookDirection.Up]: {field: 'pitch', value: 1},
  [LookDirection.Down]: {field: 'pitch', value: -1},
  [LookDirection.Left]: {field: 'heading', value: -1},
  [LookDirection.Right]: {field: 'heading', value: 1},
};

const MoveDirection = {
  Forward: 'KeyW',
  Backward: 'KeyS',
  Left: 'KeyA',
  Right: 'KeyD',
};

const MoveDirectionsDelta = {
  [MoveDirection.Forward]: 180,
  [MoveDirection.Backward]: 0,
  [MoveDirection.Left]: 90,
  [MoveDirection.Right]: -90,
};

@Component({
  selector: 'keyboard-control',
  template: '',
})
export class KeyboardControlComponent implements OnInit {
  private inspector = false;
  private viewer;
  private lookFactor = 0;
  private lastLook;

  constructor(private character: CharacterService,
              private keyboardControlService: KeyboardControlService,
              private cesiumService: CesiumService,
              private keyboardKeysService: KeyboardKeysService,
              private gameService: GameService,
              private collisionDetector: CollisionDetectorService,
              private ngZone: NgZone) {
    this.viewer = cesiumService.getViewer();
  }

  buildLookConfig(lookDirection: string) {
    const lookDelta = LookDirectionsDelta[lookDirection];
    return {
      validation: () => {
        return (
          this.character.viewState !== ViewState.OVERVIEW &&
          (this.character.state === MeModelState.RUNNING ||
            this.character.state === MeModelState.WALKING ||
            this.character.state === MeModelState.SHOOTING)
        );
      },
      action: () => {
        if (this.lastLook === lookDirection) {
          this.lookFactor += 0.1;
        } else {
          this.lookFactor = 1;
        }
        const lookField = this.character[lookDelta.field];
        if (lookField) {
          this.character[lookDelta.field] = lookField + (lookDelta.value * this.lookFactor);
        }
        this.lastLook = lookDirection;
      }
    };
  }

  buildMovementConfig(direction: string) {
    const delta = MoveDirectionsDelta[direction];
    return {
      validation: () => {
        return (
          this.character.viewState !== ViewState.OVERVIEW &&
          (this.character.state === MeModelState.RUNNING ||
            this.character.state === MeModelState.WALKING ||
            this.character.state === MeModelState.SHOOTING)
        );
      },
      action: () => {
        const position = this.character.location;
        let speed = environment.movement.walkingSpeed;

        if (this.character.state === MeModelState.RUNNING) {
          speed = environment.movement.runningSpeed;
        }
        if (this.character.isCrawling) {
          speed = environment.movement.crawlingSpeed;
        }

        const nextLocation = GeoUtilsService.pointByLocationDistanceAndAzimuth(
          position,
          speed,
          Cesium.Math.toRadians(this.character.heading + delta),
          true
        );
        if (this.character.enteredBuilding) {
          if (!this.collisionDetector.detectCollision(nextLocation, true)) {
            this.character.location = nextLocation;
          }
        }
        else if (direction !== MoveDirection.Forward) {
          this.character.location = nextLocation;
          if (this.collisionDetector.collision) {
            this.collisionDetector.detectCollision(nextLocation, true);
          }
        }
        else if (!this.collisionDetector.detectCollision(nextLocation)) {
          this.character.location = nextLocation;
        }

      },
    } as KeyboardControlParams;
  }

  changeViewMove() {
    if (this.character.viewState === ViewState.OVERVIEW) {
      return;
    }
    this.character.state = MeModelState.WALKING;
    let newState = ViewState.SEMI_FPV;
    if (this.character.viewState === ViewState.SEMI_FPV) {
      newState = ViewState.FPV;
    }
    this.character.viewState = newState;
    this.character.updateCharacter();
  }

  changeMeShootState() {
    if (this.character.viewState === ViewState.OVERVIEW) {
      return;
    }
    let newState = MeModelState.WALKING;
    if (this.character.state !== MeModelState.SHOOTING) {
      newState = MeModelState.SHOOTING;
      this.character.viewState = ViewState.FPV;
    }
    this.character.state = newState;
  }

  changeCrawlingState() {
    if (this.character.viewState === ViewState.OVERVIEW) {
      return;
    }
    let crawling = false;
    if (!this.character.isCrawling) {
      crawling = true;
    }
    this.character.isCrawling = crawling;
  }

  toggleInspector(inspectorClass, inspectorProp) {
    if (!environment.production) {
      if (!this.inspector) {
        this.cesiumService.getViewer().extend(inspectorClass);
        this.inspector = true;
      } else {
        this.cesiumService.getViewer()[inspectorProp].container.remove();
        this.inspector = false;
      }
    }
  }

  changeOverviewMode() {
    const isViewer = this.character.meFromServer['__typename'] === 'Viewer';
    if (!isViewer && this.character.viewState === ViewState.OVERVIEW) {
      this.character.viewState = ViewState.SEMI_FPV;
    } else {
      this.character.viewState = ViewState.OVERVIEW;
    }
  }

  ngOnInit() {
    const keyboardDefinitions = this.createMovementDefinitions();
    this.keyboardControlService.setKeyboardControls(
      keyboardDefinitions,
      (keyEvent: KeyboardEvent) => {
        if (keyEvent.code === 'KeyW') {
          if (
            (this.character.state === MeModelState.WALKING ||
            this.character.state === MeModelState.RUNNING) &&
            this.character.viewState !== ViewState.OVERVIEW
          ) {
            this.character.state = keyEvent.shiftKey ? MeModelState.RUNNING : MeModelState.WALKING;
          }

          return MoveDirection.Forward;
        }
        else {
          return keyEvent.code;
        }
      },
      true
    );

    this.addKeyboardEvents();
  }

  private createMovementDefinitions() {
    const keyboardDefinitions = {
      [MoveDirection.Forward]: this.buildMovementConfig(MoveDirection.Forward),
      [LookDirection.Up]: this.buildLookConfig(LookDirection.Up),
      [LookDirection.Left]: this.buildLookConfig(LookDirection.Left),
      [LookDirection.Right]: this.buildLookConfig(LookDirection.Right),
      [LookDirection.Down]: this.buildLookConfig(LookDirection.Down),
    };
    !environment.controls.disableBackward && Object.assign(keyboardDefinitions, {[MoveDirection.Backward]: this.buildMovementConfig(MoveDirection.Backward)});
    !environment.controls.disableLeft && Object.assign(keyboardDefinitions, {[MoveDirection.Right]: this.buildMovementConfig(MoveDirection.Right)});
    !environment.controls.disableRight && Object.assign(keyboardDefinitions, {[MoveDirection.Left]: this.buildMovementConfig(MoveDirection.Left)});
    return keyboardDefinitions;
  }

  private addKeyboardEvents() {
    this.keyboardKeysService.init();
    this.keyboardKeysService.registerKeyBoardEventDescription('KeyW', 'Move Forward');
    if (!environment.controls.disableBackward) {
      this.keyboardKeysService.registerKeyBoardEventDescription('KeyS', 'Move Backward');
    }
    if (!environment.controls.disableLeft) {
      this.keyboardKeysService.registerKeyBoardEventDescription('KeyA', 'Move Left');
    }
    if (!environment.controls.disableRight) {
      this.keyboardKeysService.registerKeyBoardEventDescription('KeyD', 'Move Right');
    }
    this.keyboardKeysService.registerKeyBoardEvent('KeyC', 'Switch Crawling', () => {
      this.ngZone.run(() => {
        this.changeCrawlingState();
      });
    });
    this.keyboardKeysService.registerKeyBoardEvent('KeyM', 'Switch Overview Mode', () => {
      this.ngZone.run(() => {
        this.changeOverviewMode();
      });
    });
    this.keyboardKeysService.registerKeyBoardEvent('Tab', 'Switch FPV/Semi FPV',
      (keyEvent: KeyboardEvent) => {
        this.ngZone.run(() => {
          keyEvent.preventDefault();
          this.changeViewMove();
        });
      });
    this.keyboardKeysService.registerKeyBoardEvent('KeyE', 'Enter Nearby Building',
      (keyEvent: KeyboardEvent) => {
        if (this.character.enteredBuilding) {
          this.character.exitBuilding();
          this.gameService.updateServerOnPosition(true);

        } else if (this.character.nearbyBuildingPosition) {
          this.character.enterBuilding();
          this.gameService.updateServerOnPosition(true);
        }
      });
    this.keyboardKeysService.registerKeyBoardEventDescription('Shift', 'Run');
    this.keyboardKeysService.registerKeyBoardEvent('Space', 'Switch Shooting Mode',
      (keyEvent: KeyboardEvent) => {
        this.ngZone.run(() => {
          keyEvent.preventDefault();
          this.changeMeShootState();
        });
      });
    this.keyboardKeysService.registerKeyBoardEvent('KeyI', null,
      (keyEvent: KeyboardEvent) => {
        this.toggleInspector(Cesium.viewerCesiumInspectorMixin, 'cesiumInspector');
      });
    this.keyboardKeysService.registerKeyBoardEvent('KeyO', null,
      (keyEvent: KeyboardEvent) => {
        this.toggleInspector(Cesium.viewerCesium3DTilesInspectorMixin, 'cesium3DTilesInspector');
      });

    this.keyboardKeysService.registerKeyBoardEventDescription('LookAroundMouse', 'Look around');
    this.keyboardKeysService.registerKeyBoardEventDescription('arrows', 'Look around');
  }
}
