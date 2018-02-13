import {Component, Input, OnInit} from '@angular/core';
import {CharacterService} from "../../../services/character.service";

@Component({
  selector: 'flight-mode',
  styleUrls: ['./flight-mode.component.scss'],
  template: `
    <div class="flight-container" *ngIf="me">
      <div class="img-container clickable" (click)="setFlightMode()">
        <img src="assets/icons/jetpack.svg">
      </div>
      <div class="text">00:05:00</div>
    </div>
  `

})
export class FlightModeComponent implements OnInit {
  @Input() me;
  @Input() username;

  constructor(private character: CharacterService) {
  }

  ngOnInit() {
  }

  setFlightMode() {
    // this.me.isFlying = true;
    this.character.isFlying = !this.character.isFlying;
  }

}
