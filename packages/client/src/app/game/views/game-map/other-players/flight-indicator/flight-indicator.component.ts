import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CharacterService, ViewState } from '../../../../services/character.service';
import { Observable } from 'rxjs/Observable';
import { AcNotification, ActionType } from 'angular-cesium';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { GameService } from '../../../../services/game.service';
import { PlayerFields } from "../../../../../types";
import { TakeControlService } from "../../../../services/take-control.service";

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
              private gameService: GameService,
              private takeControlService: TakeControlService) {
    this.isOverview$ = character.viewState$.map(viewState => viewState === ViewState.OVERVIEW
      );
  }

  ngOnDestroy(): void {
    this.flights$.unsubscribe();
    this.flightsSubscription.unsubscribe();
  }

  getJetpackImage() {
    return '/assets/icons/jetpack.png';
    // return '/assets/icons/jetpack-marker.svg';
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.flightsSubscription = this.gameService.getCurrentGameData()
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
        .subscribe(flyingPlayer => {
          this.flights$.next(flyingPlayer)
        })
    });
  }
  getPlayerIcon(player: PlayerFields.Fragment) {
    const url = player.character && player.character.iconUrl;
    if (url) {
      const urlSplit = url.split(".");
      let postfix = "";
      if (player.state === "DEAD") {
        postfix = "-dead";
      } else if (
        this.takeControlService.selectedPlayerToControl &&
        player.id === this.takeControlService.selectedPlayerToControl.id
      ) {
        postfix += "-chosen";
      }
      if (player.isMe) {
        postfix += "-me";
      }

      return `${urlSplit[0]}${postfix}.${urlSplit[1]}`;
    } else {
      return "/assets/icons/grey-mark.png";
    }
  }
  getLabelPixelOffset(player: PlayerFields.Fragment) {
    let xOffset = -10;
    xOffset -= player.character.name.length * 2.5;

    return [xOffset, 45];
  }
  getPlayerName(player) {
    return player.username ? player.username : "";
  }
}
