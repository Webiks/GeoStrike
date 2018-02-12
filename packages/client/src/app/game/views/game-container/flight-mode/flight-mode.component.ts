import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'flight-mode',
  styleUrls: ['./flight-mode.component.scss'],
  template: `
    <div class="flight-container" *ngIf="me">
      <div class="img-container" (click)="setFlightMode()"></div>
      <div class="text">00:05:00</div>
    </div>
  `

})
export class FlightModeComponent implements OnInit {
  @Input() me;
  @Input() username;

  constructor() {
  }

  ngOnInit() {
  }

  setFlightMode() {

  }

}
