import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'blood-on-screen',
  templateUrl: './blood-on-screen.html',
  styleUrls: ['./blood-on-screen.scss']
})
export class BloodOnScreen {
  @Input() lifeState;


  getCondition(condition: string) {
    if (this.lifeState && condition === this.lifeState.lifeState)
      return true
    return false
  }

}
