import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'other-players-gun-sound',
  template: `
    <gun-sound #gunSound></gun-sound>
  `,
  styleUrls: ['./other-players-gun-sound.component.scss']
})
export class OtherPlayersGunSoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
