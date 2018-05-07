import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'key-button',
  template: `
    <div class="button" [ngClass]="{'space-btn':keyInfo.keyName === 'Space' }" [ngSwitch]="keyInfo.keyName">
      <img  *ngSwitchCase="'LeftMouse'" src="/assets/icons/left-click.png" class="mouse">
      <img  *ngSwitchCase="'LookAroundMouse'" src="/assets/icons/mouse_movement.png" class="mouse">
      <img  *ngSwitchCase="'arrow-up'" src="/assets/icons/arrow-up.png" class="arrow">
      <img  *ngSwitchCase="'arrow-down'" src="/assets/icons/arrow-down.png" class="arrow">
      <img  *ngSwitchCase="'arrow-left'" src="/assets/icons/arrow-left.png" class="arrow">
      <img  *ngSwitchCase="'arrow-right'" src="/assets/icons/arrow-right.png" class="arrow">
      <!--<span *ngSwitchCase="'Shift'">Shift + W</span>-->
      <img  *ngSwitchCase="'Shift'" src="/assets/icons/W_SHIFT.png ">
      <img  *ngSwitchCase="'Tab'" src="/assets/icons/TAB.png ">
      
      <span *ngSwitchDefault> {{keyInfo.keyName}}</span>
    </div>
  `,
  styleUrls: ['./key-button.component.scss']
})
export class KeyButtonComponent implements OnInit {
  @Input()
  keyInfo: { keyName: string };

  constructor() {
  }

  ngOnInit() {
  }

}
