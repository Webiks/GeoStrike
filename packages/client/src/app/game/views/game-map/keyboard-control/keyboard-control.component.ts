import { Component, NgZone, OnInit } from '@angular/core';
import { CesiumService, GeoUtilsService, KeyboardControlParams, KeyboardControlService, } from 'angular-cesium';
import { CharacterService, MeModelState, ViewState, } from '../../../services/character.service';
import { environment } from '../../../../../environments/environment';
import { KeyboardKeysService } from '../../../../core/services/keyboard-keys.service';
import { GameService } from '../../../services/game.service';
import { CollisionDetectorService } from '../../../services/collision-detector.service';

const Direction = {
  Forward: 'KeyW',
  Backward: 'KeyS',
  Left: 'KeyA',
  Right: 'KeyD',
};

const DirectionsDelta = {
  [Direction.Forward]: 180,
  [Direction.Backward]: 0,
  [Direction.Left]: 90,
  [Direction.Right]: -90,
};

@Component({
  selector: 'keyboard-control',
  template: '',
})
export class KeyboardControlComponent implements OnInit {
  private inspector = false;
  private viewer;

  constructor(private character: CharacterService,
              private keyboardControlService: KeyboardControlService,
              private cesiumService: CesiumService,
              private keyboardKeysService: KeyboardKeysService,
              private gameService: GameService,
              private collisionDetector: CollisionDetectorService,
              private ngZone: NgZone) {
    this.viewer = cesiumService.getViewer();
  }

  buildMovementConfig(direction: string) {
    const delta = DirectionsDelta[direction];
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
        else if (direction !== Direction.Forward) {
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
    this.character.isCrawling = false;
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
      this.character.viewState = ViewState.FPV;
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

  ngOnInit() {
    const keyboardDefinitions = this.createMovementDefinitions();
    this.keyboardControlService.setKeyboardControls(
      keyboardDefinitions,
      (keyEvent: KeyboardEvent) => {
        if (keyEvent.code === 'KeyW' || keyEvent.code === 'ArrowUp') {
          if (this.character.state !== MeModelState.SHOOTING) {
            this.character.state = keyEvent.shiftKey
              ? MeModelState.RUNNING
              : this.character.state;
          }

          return Direction.Forward;
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
      [Direction.Forward]: this.buildMovementConfig(Direction.Forward),
    };
    !environment.keys.disableBackward && Object.assign(keyboardDefinitions, {[Direction.Backward]: this.buildMovementConfig(Direction.Backward)});
    !environment.keys.disableLeft && Object.assign(keyboardDefinitions, {[Direction.Right]: this.buildMovementConfig(Direction.Right)});
    !environment.keys.disableRight && Object.assign(keyboardDefinitions, {[Direction.Left]: this.buildMovementConfig(Direction.Left)});
    return keyboardDefinitions;
  }

  private addKeyboardEvents() {
    this.keyboardKeysService.init();
    this.keyboardKeysService.registerKeyBoardEventDescription('KeyW', 'Move Forward');
    if (!environment.keys.disableBackward) {
      this.keyboardKeysService.registerKeyBoardEventDescription('KeyS', 'Move Backward');
    }
    if (!environment.keys.disableLeft) {
      this.keyboardKeysService.registerKeyBoardEventDescription('KeyA', 'Move Left');
    }
    if (!environment.keys.disableRight) {
      this.keyboardKeysService.registerKeyBoardEventDescription('KeyD', 'Move Right');
    }
    this.keyboardKeysService.registerKeyBoardEvent('KeyC', 'Switch Crawling', () => {
      this.ngZone.run(() => {
        this.changeCrawlingState();
      })
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
  }
}
