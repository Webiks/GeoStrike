import { Injectable } from '@angular/core';

@Injectable()
export class SoundService {
  private gunShotSound = new Audio('assets/sound/smg_shoot.wav');

  constructor() {
    this.gunShotSound.volume = 0;
    this.gunShotSound.play();
  }

  gunShot(volume = 1.0) {
    this.gunShotSound.volume = volume;
    this.gunShotSound.currentTime = 0;
    this.gunShotSound.play();
  }
}
