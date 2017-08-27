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
          const step = headingVector(currentState.heading);
          const result = Cesium.Cartesian3.add(position, step, new Cesium.Cartesian3());

          this.me$.next({
            ...currentState,
            location: result,
          });
        },
      },
    });
  }
}

function headingVector(heading: number) {
  const x = Math.cos(heading);
  const y = Math.sin(heading);
  return new Cesium.Cartesian3(x, y, 0);
}
