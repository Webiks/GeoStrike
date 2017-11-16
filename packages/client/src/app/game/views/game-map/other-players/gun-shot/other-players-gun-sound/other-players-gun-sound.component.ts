import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { OtherPlayersShotService } from '../other-players-shot.service';
import { Subscription } from 'rxjs/Subscription';
import { CharacterService, ViewState } from '../../../../../services/character.service';
import { SoundService } from '../../../../../services/sound.service';

@Component({
  selector: 'other-players-gun-sound',
  template: ``,
  styleUrls: ['./other-players-gun-sound.component.scss'],
})
export class OtherPlayersGunSoundComponent implements OnInit, OnDestroy {

  shotSubscription: Subscription;
  private readonly maxSoudnDistance = 500;

  constructor(private otherPlayersGunShotService: OtherPlayersShotService,
              private character: CharacterService,
              private ngZone: NgZone,
              private soundService: SoundService) {
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.shotSubscription = this.otherPlayersGunShotService.subscribeToGunShot().subscribe((data) => {
        const shotTime = window['shotTime'];
        console.log('round trip time: ' + (performance.now() -shotTime)  + ' ms');
        if (this.character.viewState !== ViewState.OVERVIEW) {
          const distanceToShot = Cesium.Cartesian3.distance(this.character.location, data.gunShot.shotPosition);

          let volume = 0;
          if (distanceToShot < this.maxSoudnDistance) {
            const factor = distanceToShot ? distanceToShot / this.maxSoudnDistance : 1;
            volume = 1 - factor;
          }

          // this.soundService.gunShot(volume);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.shotSubscription.unsubscribe();
  }

}
