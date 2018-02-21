import {ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {CharacterService, MeModelState} from "../../../services/character.service";
import {Subscription} from "rxjs/Subscription";
import {FlightData} from "../../../../types";
import {ActionType} from "angular-cesium";
import {GameService} from "../../../services/game.service";

@Component({
  selector: 'flight-mode',
  styleUrls: ['./flight-mode.component.scss'],
  templateUrl: './flight-mode.component.html'

})
export class FlightModeComponent implements OnInit, OnDestroy {
  @Input() me;
  @Input() username;
  flightDataSubscription: Subscription;
  flightData: FlightData;
  playerId: string;
  minutes: string;
  seconds: string;

  constructor(private character: CharacterService, private gameService: GameService, private ngZone: NgZone, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.flightDataSubscription = this.gameService.getCurrentGameData()
      // .filter(()=> this.character.viewState === ViewState.OVERVIEW)
        .map(result => result.gameData.me)
        // .flatMap(p => p)
        // .filter(p=> p.type === 'PLAYER')
        .map(player => {
          return {
            id: player.id,
            actionType: ActionType.ADD_UPDATE,
            entity: player,
          }
        })
        .subscribe(player => {
          this.flightData = player.entity.flight;
          this.playerId = player.id;
          this.calculateRemainingTime(this.flightData.remainingTime);
          this.cd.detectChanges();
        })
    });
  }

  setFlightMode() {
    // this.me.isFlying = true;
    this.character.isFlying = !this.character.isFlying;
    console.log(this.character.isFlying);
    const flightSubscription = this.gameService.toggleFlightMode(this.playerId, this.character.isFlying).subscribe(() => flightSubscription.unsubscribe());
  }

  ngOnDestroy() {
    // this.flightSubscription.unsubscribe();
    this.flightDataSubscription.unsubscribe();
  }

  calculateRemainingTime(timeInSeconds) {
    this.minutes = (Math.floor(timeInSeconds / 60)).toString();
    this.seconds = (timeInSeconds - (+this.minutes * 60)).toString();
  }

  isPlayerRunning(movingType: number){
    if(this.character.state === movingType){
      console.log("good");
      return true;
    }
    else{
      console.log("err");
      return false;
    }
  }
  isPlayerWalking(movingType: number){
    if(this.character.state === movingType){
      console.log("good");
      return true;
    }
    else{
      console.log("err");
      return false;
    }
  }

}
