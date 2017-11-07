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

  play(volume = 1.0) {
    const soundElement : HTMLAudioElement= this.gunShotSound.nativeElement;
    soundElement.currentTime = 0;
    soundElement.volume = volume;
    soundElement.play();
  }
}
