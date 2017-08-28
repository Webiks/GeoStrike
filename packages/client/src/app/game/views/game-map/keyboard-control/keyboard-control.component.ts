import { Component, OnInit } from '@angular/core';
import { KeyboardControlService, GeoUtilsService } from 'angular-cesium';
import { CharacterService, MeModelState, ViewState } from '../../../services/character.service';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'keyboard-control',
  template: '',
})
export class KeyboardControlComponent implements OnInit {
  constructor(private gameService: GameService, private character: CharacterService, private keyboardControlService: KeyboardControlService) {
  }

  buildMovementConfig(multipleBy) {
    return {
      validation: () => {
        return this.character.state === MeModelState.RUNNING || this.character.state === MeModelState.WALKING;
      },
      action: () => {
        const position = this.character.location;
        let speed = 0.15;

        if (this.character.state === MeModelState.RUNNING) {
          speed = 0.3;
        }

        this.character.location = GeoUtilsService.pointByLocationDistanceAndAzimuth(
          position,
          multipleBy * speed,
          Cesium.Math.toRadians(this.character.heading),
          true);
        this.gameService.updatePosition(this.character.location, this.character.heading);
      },
    };
  }

  buildViewMoveConfig() {
    return {
      validation: () => {
        return this.character.state === MeModelState.RUNNING || this.character.state === MeModelState.WALKING;
      },
      action: () => {
        let newState;

        if (this.character.viewState === ViewState.SEMI_FPV) {
          newState = ViewState.FPV;
        } else {
          newState = ViewState.SEMI_FPV;
        }

        this.character.viewState = newState;

        return true;
      },
    };
  }

  ngOnInit() {
    this.keyboardControlService.setKeyboardControls({
      Forward: this.buildMovementConfig(-1),
      Backward: this.buildMovementConfig(1),
      ChangeViewMode: this.buildViewMoveConfig(),
    }, (keyEvent: KeyboardEvent) => {
      if (keyEvent.code === 'KeyW' || keyEvent.code === 'ArrowUp') {
        if (keyEvent.shiftKey) {
          this.character.state = MeModelState.RUNNING;
        } else {
          this.character.state = MeModelState.WALKING;
        }

        return 'Forward';
      } else if (keyEvent.code === 'Tab') {
        keyEvent.preventDefault();
        
        return 'ChangeViewMode';
      } else if (keyEvent.code === 'KeyS' || keyEvent.code === 'ArrowDown') {
        return 'Backward';
      } else {
        return String.fromCharCode(keyEvent.keyCode);
      }
    });
  }
}
