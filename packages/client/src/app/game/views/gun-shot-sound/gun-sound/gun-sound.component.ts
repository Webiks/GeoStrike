import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'gun-sound',
  template: `
    <audio #gunShotSound src="assets/sound/smg_shoot.wav"></audio>
  `,
  styleUrls: ['./gun-sound.component.scss']
})
export class GunSoundComponent implements OnInit {

  @ViewChild('gunShotSound') gunShotSound: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  play() {
    const soundElement = this.gunShotSound.nativeElement;
    soundElement.currentTime = 0;
    soundElement.play();
  }
}
