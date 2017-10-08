import { Component, NgZone, OnInit } from '@angular/core';
import { CesiumService, GeoUtilsService, KeyboardControlParams, KeyboardControlService, } from 'angular-cesium';
import { CharacterService, MeModelState, ViewState, } from '../../../services/character.service';
import { environment } from '../../../../../environments/environment';
import { KeyboardKeysService } from '../../../../core/services/keyboard-keys.service';
import { GameSettingsService } from '../../../services/game-settings.service';
import { GameService } from '../../../services/game.service';

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
  private COLLIDE_FACTOR_METER = 3;
  private inspector = false;
  private viewer;

  constructor(private character: CharacterService,
              private keyboardControlService: KeyboardControlService,
              private cesiumService: CesiumService,
              private keyboardKeysService: KeyboardKeysService,
              private gameService: GameService,
              private ngZone: NgZone) {
    this.viewer = cesiumService.getViewer();
  }


  private getDepthDistance(fromLocation: Cartesian3, toWindowPosition: Cartesian2) {
    const toLocation = this.viewer.scene.pickPosition(toWindowPosition);
    if (!toLocation) {
      return Number.MAX_SAFE_INTEGER;
    }
    const distance = Cesium.Cartesian3.distance(fromLocation, toLocation);
    return distance ? distance : Number.MAX_SAFE_INTEGER;
  }

  private detectCollision(fromLocation): boolean {
    this.character.nearbyBuildingPosition = undefined;
    const centerWindowPosition = new Cesium.Cartesian2(
      document.body.clientWidth / 2,
      document.body.clientHeight / 2
    );
    const leftWindowPosition = centerWindowPosition.clone();
    leftWindowPosition.x -= 150;
    const rightWindowPosition = centerWindowPosition.clone();
    rightWindowPosition.x += 150;

    const pickedFeature = this.viewer.scene.pick(centerWindowPosition, 300, 300);

    // if the center is a tile or a model but not ground

    if (pickedFeature && !pickedFeature.mesh && pickedFeature._batchId) {
      const collision = this.getDepthDistance(fromLocation, centerWindowPosition) < this.COLLIDE_FACTOR_METER;
      if (collision && !this.character.isInsideBuilding) {
        const id = pickedFeature._batchId;
        const batchTableJson = pickedFeature._content._batchTable.batchTableJson;
        const latitude = batchTableJson.latitude[id];
        const longitude = batchTableJson.longitude[id];
        const area = batchTableJson.area[id];
        if (area <= GameSettingsService.maxEnterableBuildingSize) {
          this.character.nearbyBuildingPosition = Cesium.Cartesian3.fromRadians(longitude, latitude, 0);
          this.character.building = pickedFeature;
        }
      }
      // this.getDepthDistance(fromLocation, leftWindowPosition) < this.COLLIDE_FACTOR_METER ||
      // this.getDepthDistance(fromLocation, rightWindowPosition) < this.COLLIDE_FACTOR_METER
      return collision;
    } else {
      return false;
    }
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
        if (direction !== Direction.Forward || !this.detectCollision(nextLocation)) {
          this.character.location = nextLocation;
        }

      },
    } as KeyboardControlParams;
  }

  changeViewMove() {
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
        if (this.character.isInsideBuilding) {
          this.character.building.show = true;
          this.character.location = this.character.enteringBuildingPosition;
          this.character.isInsideBuilding = false;
          this.character.building = undefined;
          this.character.enteringBuildingPosition = undefined;
          this.character.nearbyBuildingPosition = undefined;
          this.gameService.updateServerOnPosition(true);

        } else if (this.character.nearbyBuildingPosition) {
          this.character.building.show = false;
          this.character.enteringBuildingPosition = this.character.location;
          this.character.location = this.character.nearbyBuildingPosition;
          this.character.isInsideBuilding = true;
          this.character.nearbyBuildingPosition = undefined;
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
