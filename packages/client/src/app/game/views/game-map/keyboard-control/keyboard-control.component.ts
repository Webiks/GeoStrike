import { Component, NgZone, OnInit } from '@angular/core';
import {
  CesiumService,
  GeoUtilsService,
  KeyboardControlParams,
  KeyboardControlService,
} from 'angular-cesium';
import {
  CharacterService,
  MeModelState,
  ViewState,
} from '../../../services/character.service';
import { environment } from '../../../../../environments/environment';

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
  inspector = false;

  constructor(
    private character: CharacterService,
    private keyboardControlService: KeyboardControlService,
    private cesiumService: CesiumService,
    private ngZone: NgZone,
  ) {}

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
        let speed = 0.15;

        if (this.character.state === MeModelState.RUNNING) {
          speed = 0.3;
        }

        this.character.location = GeoUtilsService.pointByLocationDistanceAndAzimuth(
          position,
          speed,
          Cesium.Math.toRadians(this.character.heading + delta),
          true
        );
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

    this.ngZone.runOutsideAngular(()=>{
      // Regitster Other keys because keyboardControl key are triggered by cesium tick
      document.addEventListener('keydown', (keyEvent: KeyboardEvent) => {
        switch (keyEvent.code) {
          case 'Tab':
            this.ngZone.run(()=>{
              keyEvent.preventDefault();
              this.changeViewMove();
            });
            break;
          case 'Space':
            this.ngZone.run(()=>{
              keyEvent.preventDefault();
              this.changeMeShootState();
            });
            break;
          case 'KeyI':
            this.toggleInspector(Cesium.viewerCesiumInspectorMixin, 'cesiumInspector');
            break;
          case 'KeyO':
            this.toggleInspector(
              Cesium.viewerCesium3DTilesInspectorMixin,
              'cesium3DTilesInspector'
            );
            break;
          default:
            break;
        }
      });
    });
  }
}
