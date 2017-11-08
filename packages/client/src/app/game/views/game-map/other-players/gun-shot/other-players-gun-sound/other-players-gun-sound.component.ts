import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OtherPlayersShotService } from '../other-players-shot.service';
import { Subscription } from 'rxjs/Subscription';
import { CharacterService, ViewState } from '../../../../../services/character.service';
import { GunSoundComponent } from '../gun-sound/gun-sound.component';

@Component({
  selector: 'other-players-gun-sound',
  template: `
    <gun-sound #gunSound></gun-sound>
  `,
  styleUrls: ['./other-players-gun-sound.component.scss'],
})
export class OtherPlayersGunSoundComponent implements OnInit, OnDestroy {

  @ViewChild('gunSound') gunSound: GunSoundComponent;
  shotSubscription: Subscription;
  private readonly maxSoudnDistance = 500;

  constructor(private otherPlayersGunShotService: OtherPlayersShotService,
              private character: CharacterService,
              private ngZone: NgZone) {
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.shotSubscription = this.otherPlayersGunShotService.subscribeToGunShot().subscribe((data) => {
        if (this.character.viewState !== ViewState.OVERVIEW) {
          const distanceToShot = Cesium.Cartesian3.distance(this.character.location, data.gunShot.shotPosition);

          let volume = 0;
          if (distanceToShot <this.maxSoudnDistance){
            const factor = distanceToShot ? distanceToShot / this.maxSoudnDistance : 1;
            volume = 1 - factor;
          }

          this.gunSound.play(volume);
        }
      })
    });
  }

  ngOnDestroy(): void {
    this.shotSubscription.unsubscribe();
  }

}
