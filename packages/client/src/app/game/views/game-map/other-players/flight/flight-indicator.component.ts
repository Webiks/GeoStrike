import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CharacterService, ViewState } from '../../../../services/character.service';
import { Observable } from 'rxjs/Observable';
import { AcNotification, ActionType } from 'angular-cesium';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { GameService } from '../../../../services/game.service';

@Component({
  selector: 'flight-indicator',
  templateUrl: './flight-indicator.component.html',
})
export class FlightIndicator implements OnInit, OnDestroy {

  flights$: Subject<AcNotification> = new Subject();
  flightsSubscription: Subscription;
  isOverview$: Observable<boolean>;
  eyeOffset = new Cesium.Cartesian3(0.0, 0.0, -10.0 );

  constructor(private character: CharacterService,
              private ngZone: NgZone,
              private gameService: GameService) {
    this.isOverview$ = character.viewState$.map(viewState => viewState === ViewState.OVERVIEW);
  }

  ngOnDestroy(): void {
    this.flights$.unsubscribe();
    this.flightsSubscription.unsubscribe();
  }


  getJetpackImage() {
    return '/assets/icons/spiderman.png';
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.flightsSubscription = this.gameService.getCurrentGameData()
        .filter(()=> this.character.viewState === ViewState.OVERVIEW)
        .map(result => result.gameData.players)
        .flatMap(p => p)
        .filter(p=> p.type === 'PLAYER')
        .map(player => {
          return {
            id: player.id,
            actionType: ActionType.ADD_UPDATE,
            entity: player,
          }
        })
        .subscribe(shotEntity => {
          this.flights$.next(shotEntity)
        })
    });
  }
}
