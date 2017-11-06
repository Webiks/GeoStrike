import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'key-button',
  template: `
    <div class="button" [ngClass]="{'space-btn':keyInfo.keyName === 'Space' }" [ngSwitch]="keyInfo.keyName">
      <mat-icon  *ngSwitchCase="'LeftMouse'" svgIcon="left-mouse" class="mouse"></mat-icon>
      <mat-icon  *ngSwitchCase="'LookAroundMouse'" svgIcon="look-around-mouse" class="mouse"></mat-icon>
      <img  *ngSwitchCase="'arrow-up'" src="/assets/icons/arrow-up.png" class="arrow">
      <img  *ngSwitchCase="'arrow-down'" src="/assets/icons/arrow-down.png" class="arrow">
      <img  *ngSwitchCase="'arrow-left'" src="/assets/icons/arrow-left.png" class="arrow">
      <img  *ngSwitchCase="'arrow-right'" src="/assets/icons/arrow-right.png" class="arrow">
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
