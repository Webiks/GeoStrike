import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'key-button',
  template: `
    <div class="button" [ngClass]="{'space-btn':keyInfo.keyName === 'Space' }">
      <span *ngIf="keyInfo.keyName !== 'LeftMouse'; else mouse"> {{keyInfo.keyName}}</span>
      <ng-template #mouse>
        <mat-icon svgIcon="left-mouse" class="mouse"></mat-icon>
      </ng-template>
    </div>
  `,
  styleUrls: ['./key-button.component.scss']
})
export class KeyButtonComponent implements OnInit {

  @Input()
  keyInfo: {keyName:string};
  constructor() { }

  ngOnInit() {
  }

}
