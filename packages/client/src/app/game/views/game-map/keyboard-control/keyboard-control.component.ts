import { Component, Input, OnInit } from '@angular/core';
import { KeyboardControlService, GeoUtilsService } from 'angular-cesium';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MeModelState, MeState } from '../game-map.component';

@Component({
  selector: 'keyboard-control',
  template: '',
})
export class KeyboardControlComponent implements OnInit {
  @Input() me$: BehaviorSubject<MeState>;

  constructor(private keyboardControlService: KeyboardControlService) {
  }

  buildMovementConfig(multipleBy) {
    return {
      validation: () => {
        return this.me$.getValue().state === MeModelState.RUNNING || this.me$.getValue().state === MeModelState.WALKING;
      },
      params: () => {
        if (this.me$.getValue().state === MeModelState.WALKING) {
          return { speed: 0.4 };
        } else if (this.me$.getValue().state === MeModelState.RUNNING) {
          return { speed: 0.7 };
        }

        return {};
      },
      action: (camera, globe, params) => {
        const currentState = this.me$.getValue();
        const position = currentState.location;
        const result = GeoUtilsService.pointByLocationDistanceAndAzimuth(
          position,
          multipleBy * params.speed,
          Cesium.Math.toRadians(currentState.heading),
          true);

        this.me$.next({
          ...currentState,
          location: result,
        });
      },
    };
  }

  ngOnInit() {
    this.keyboardControlService.setKeyboardControls({
      W: this.buildMovementConfig(1),
      S: this.buildMovementConfig(-1),
      Space: {
        action: () => {
          const currentState = this.me$.getValue();

          this.me$.next({
            ...currentState,
            state: MeModelState.RUNNING
          });
        }
      }
    }, (keyEvent: KeyboardEvent) => {
      if (keyEvent.code === 'KeyW' || keyEvent.code === 'ArrowUp') {
        return 'W';
      } else if (keyEvent.code === 'KeyD' || keyEvent.code === 'ArrowRight') {
        return 'D';
      } else if (keyEvent.code === 'KeyA' || keyEvent.code === 'ArrowLeft') {
        return 'A';
      } else if (keyEvent.code === 'KeyS' || keyEvent.code === 'ArrowDown') {
        return 'S';
      } else if (keyEvent.keyCode === 32) {
        return 'Space';
      } else {
        return String.fromCharCode(keyEvent.keyCode);
      }
    });
  }
}
