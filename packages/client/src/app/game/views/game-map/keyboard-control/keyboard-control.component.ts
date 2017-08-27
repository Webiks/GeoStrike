import { Component, Input, OnInit } from '@angular/core';
import { KeyboardControlService, GeoUtilsService } from 'angular-cesium';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MeState } from '../game-map.component';

@Component({
  selector: 'keyboard-control',
  template: '',
})
export class KeyboardControlComponent implements OnInit {
  @Input() me$: BehaviorSubject<MeState>;

  constructor(private keyboardControlService: KeyboardControlService) {}

  ngOnInit() {
    this.me$.subscribe((meState: MeState) => {
      // Change user state
    });

    this.keyboardControlService.setKeyboardControls({
      W: {
        action: () => {
          const currentState = this.me$.getValue();
          const position = currentState.location;
          const result = GeoUtilsService.pointByLocationDistanceAndAzimuth(position, -0.5, Cesium.Math.toRadians(currentState.heading), true);

          this.me$.next({
            ...currentState,
            location: result,
          });
        },
      },
      S: {
        action: () => {
          const currentState = this.me$.getValue();
          const position = currentState.location;
          const result = GeoUtilsService.pointByLocationDistanceAndAzimuth(position, 0.5, Cesium.Math.toRadians(currentState.heading), true);

          this.me$.next({
            ...currentState,
            location: result,
          });
        },
      },
    });
  }
}
