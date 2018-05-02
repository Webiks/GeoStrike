import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CharacterService, ViewState } from '../../../../../services/character.service';
import { Observable } from 'rxjs/Observable';
import { AcNotification, ActionType } from 'angular-cesium';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { GameService } from '../../../../../services/game.service';

@Component({
  selector: 'gun-indicator',
  templateUrl: './gun-indicator.component.html',
  styleUrls: ['./gun-indicator.component.scss']
})
export class GunIndicatorComponent implements OnInit, OnDestroy {

  gunShots$: Subject<AcNotification> = new Subject();
  gunShotSubscription: Subscription;
  isOverview$: Observable<boolean>;
  eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -10.0);

  constructor(private character: CharacterService,
              private ngZone: NgZone,
              private gameService: GameService) {
    this.isOverview$ = character.viewState$.map(viewState => viewState === ViewState.OVERVIEW);
  }

  ngOnDestroy(): void {
    this.gunShots$.unsubscribe();
    this.gunShotSubscription.unsubscribe();
  }


  getGunImage() {
    return '/assets/icons/gun-marker.png';
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.gunShotSubscription = this.gameService.getCurrentGameData()
        .filter(() => this.character.viewState === ViewState.OVERVIEW)
        .map(result => result.gameData.players)
        .flatMap(p => p)
        .filter(p => p.type === 'PLAYER')
        .map(player => {
          return {
            id: player.id,
            actionType: ActionType.ADD_UPDATE,
            entity: player,
          }
        })
        .subscribe(shotEntity => {
          this.gunShots$.next(shotEntity)
        })
    });
  }

  determineOffsetIfFlying() {
    if (this.character.isFlying) {
      console.log('good');
      return [0, -100];
    }
    else {
      console.log('bad')
      return [0, -50]
    }
  }
}
