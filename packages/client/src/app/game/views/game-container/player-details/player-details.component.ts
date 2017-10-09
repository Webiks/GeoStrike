import { Component, Input, OnInit } from '@angular/core';
// import { GameFields }  from '../../../../types';

@Component({
  selector: 'player-details',
  template: `
    <div class="details-container" *ngIf="me">
      <div class="img-container" [ngClass]="{
       'blue': me?.team === 'BLUE',
       'red': me?.team === 'RED'
     }">
        <img [src]="me?.character?.portraitUrl" alt="">
      </div>
      <div class="text">{{me?.character?.name}}</div>
    </div>
  `,
  styleUrls: ['./player-details.component.scss']
})
export class PlayerDetailsComponent implements OnInit {

  @Input()
  me;

  constructor() {
  }

  ngOnInit() {
  }

}
