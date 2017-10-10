import { Component, NgZone, OnInit } from '@angular/core';
import { CesiumService, GeoUtilsService, KeyboardControlParams, KeyboardControlService, } from 'angular-cesium';
import { CharacterService, MeModelState, ViewState, } from '../../../services/character.service';
import { environment } from '../../../../../environments/environment';
import { KeyboardKeysService } from '../../../../core/services/keyboard-keys.service';
import { GameService } from '../../../services/game.service';
import { BuildingsService } from '../../../services/buildings.service';
import { CollisionDetectorService } from '../../../services/collision-detector.service';

const Direction = {
  Forward: 'Forward',
  Backward: 'Backward',
  Left: 'Left',
  Right: 'Right',
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
              private buildingsService: BuildingsService,
              private collisionDetector: CollisionDetectorService,
              private ngZone: NgZone) {
    this.viewer = cesiumService.getViewer();
  }

  buildMovementConfig(direction: string) {
    const delta = DirectionsDelta[direction];
    return {
      validation: () => {
        return (
          this.character.state === MeModelState.RUNNING ||
          this.character.state === MeModelState.WALKING ||
          this.character.state === MeModelState.SHOOTING ||
          this.character.state === MeModelState.CRAWLING
        );
      },
      action: () => {
        const position = this.character.location;
        let speed = environment.movement.walkingSpeed;

        if (this.character.state === MeModelState.RUNNING) {
          speed = environment.movement.runningSpeed;
        }


        const nextLocation = GeoUtilsService.pointByLocationDistanceAndAzimuth(
          position,
          speed,
          Cesium.Math.toRadians(this.character.heading + delta),
          true
        );
        if (this.character.enternedBuilding) {
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
    this.character.state = MeModelState.WALKING;
    let newState = ViewState.SEMI_FPV;
    if (this.character.viewState === ViewState.SEMI_FPV) {
      newState = ViewState.FPV;
    }
    this.character.viewState = newState;
    this.character.updateCharacter();
  }

  changeMeShootState() {
    let newState = MeModelState.WALKING;
    if (this.character.state !== MeModelState.SHOOTING) {
      newState = MeModelState.SHOOTING;
      this.character.viewState = ViewState.FPV;
    }
    this.character.state = newState;
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
    this.keyboardControlService.setKeyboardControls(
      {
        [Direction.Forward]: this.buildMovementConfig(Direction.Forward),
        [Direction.Backward]: this.buildMovementConfig(Direction.Backward),
        [Direction.Left]: this.buildMovementConfig(Direction.Left),
        [Direction.Right]: this.buildMovementConfig(Direction.Right),
      },
      (keyEvent: KeyboardEvent) => {
        if (keyEvent.code === 'KeyW' || keyEvent.code === 'ArrowUp') {
          if (this.character.state !== MeModelState.SHOOTING) {
            this.character.state = keyEvent.shiftKey
              ? MeModelState.RUNNING
              : MeModelState.WALKING;
          }

          return Direction.Forward;
        } else if (keyEvent.code === 'KeyS' || keyEvent.code === 'ArrowDown') {
          return Direction.Backward;
        } else if (keyEvent.code === 'KeyA' || keyEvent.code === 'ArrowLeft') {
          return Direction.Left;
        } else if (keyEvent.code === 'KeyD' || keyEvent.code === 'ArrowRight') {
          return Direction.Right;
        } else {
          return String.fromCharCode(keyEvent.keyCode);
        }
      },
      true
    );

    this.addKeyboardEvents();
  }

  private addKeyboardEvents() {
    this.keyboardKeysService.init();
    this.keyboardKeysService.registerKeyBoardEventDescription('LeftMouse', 'Shoot');
    this.keyboardKeysService.registerKeyBoardEventDescription('KeyW', 'Move Forward');
    this.keyboardKeysService.registerKeyBoardEventDescription('KeyS', 'Move Backward');
    this.keyboardKeysService.registerKeyBoardEvent('Tab', 'Switch FPV/Semi FPV',
      (keyEvent: KeyboardEvent) => {
        this.ngZone.run(() => {
          keyEvent.preventDefault();
          this.changeViewMove();
        });
      });
    this.keyboardKeysService.registerKeyBoardEvent('KeyE', 'Enter Nearby Building',
      (keyEvent: KeyboardEvent) => {
        if (this.character.enternedBuilding) {
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
