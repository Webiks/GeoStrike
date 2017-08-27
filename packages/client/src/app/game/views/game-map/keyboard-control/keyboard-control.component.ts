import { Component, Input, OnInit } from '@angular/core';
import { KeyboardControlService } from 'angular-cesium';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MeState } from '../game-map.component';

@Component({
  selector: 'keyboard-control',
  template: '',
})
export class KeyboardControlComponent implements OnInit {
  @Input() me$: BehaviorSubject<MeState>;

  constructor(private keyboardControlService: KeyboardControlService) { }

  ngOnInit() {
    this.me$.subscribe((meState: MeState) => {
      // Change user state
    });

    this.keyboardControlService.setKeyboardControls({
      W: {
        action: (camera) => {
          const currentState = this.me$.getValue();
          const position = currentState.location;
          const moveScratch = new Cesium.Cartesian3();
          const result = new Cesium.Cartesian3();
          Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.clone(camera.direction), 0.1, moveScratch);
          Cesium.Cartesian3.add(position, moveScratch, result);

          this.me$.next({
            ...currentState,
            location: result,
          });
        },
      },
    });
  }
}
