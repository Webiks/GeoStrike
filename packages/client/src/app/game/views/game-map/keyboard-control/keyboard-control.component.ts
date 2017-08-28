import { Component, OnInit } from '@angular/core';
import { KeyboardControlService, GeoUtilsService } from 'angular-cesium';
import { CharacterService, MeModelState } from '../../../services/character.service';

@Component({
  selector: 'keyboard-control',
  template: '',
})
export class KeyboardControlComponent implements OnInit {
  constructor(private character: CharacterService, private keyboardControlService: KeyboardControlService) {
  }

  buildMovementConfig(multipleBy) {
    return {
      validation: () => {
        return this.character.state === MeModelState.RUNNING || this.character.state === MeModelState.WALKING;
      },
      action: () => {
        const position = this.character.location;
        let speed = 0.2;

        if (this.character.state = MeModelState.RUNNING) {
          speed = 0.5;
        }

        this.character.location = GeoUtilsService.pointByLocationDistanceAndAzimuth(
          position,
          multipleBy * speed,
          Cesium.Math.toRadians(this.character.heading),
          true);
      },
    };
  }

  ngOnInit() {
    this.keyboardControlService.setKeyboardControls({
      WalkForward: this.buildMovementConfig(-1),
      WalkBackward: this.buildMovementConfig(1),
      RunForward: this.buildMovementConfig(-1),
    }, (keyEvent: KeyboardEvent) => {
      if (keyEvent.code === 'KeyW' || keyEvent.code === 'ArrowUp') {
        if (keyEvent.shiftKey) {
          this.character.state = MeModelState.RUNNING;
        }

        return 'WalkForward';
      } else if (keyEvent.code === 'KeyS' || keyEvent.code === 'ArrowDown') {
        return 'WalkBackward';
      } else {
        return String.fromCharCode(keyEvent.keyCode);
      }
    });
  }
}
