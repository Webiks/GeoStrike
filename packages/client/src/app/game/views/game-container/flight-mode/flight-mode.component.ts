import { ChangeDetectorRef, Component, HostListener, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CharacterService } from "../../../services/character.service";
import { Subscription } from "rxjs/Subscription";
import { FlightData } from "../../../../types";
import { ActionType } from "angular-cesium";
import { GameService } from "../../../services/game.service";
import { UtilsService } from "../../../services/utils.service";


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
  movingType: string = 'none';

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.shiftKey && event.keyCode == 87) {
      this.movingType = 'running';
    }
    if (event.key === 'w') {
      this.movingType = 'walking';
    }
  }

  @HostListener('document:keyup', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    if (event.key === 'w') {
      this.movingType = 'none';
    }
    if (event.shiftKey && event.keyCode == 87) {
      this.movingType = 'none';
    }
    if (event.shiftKey) {
      this.movingType = 'none';
    }
  }

  constructor(private character: CharacterService, private gameService: GameService, private ngZone: NgZone, private cd: ChangeDetectorRef,
              private utilsService:UtilsService) {
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
          if(this.flightData.remainingTime){
            this.calculateRemainingTime(this.flightData.remainingTime);
          }
          else {
            this.minutes = '00';
            this.seconds = '00';
            const crashSubscription = this.gameService.notifyCrash(this.playerId)
              .subscribe(() => crashSubscription.unsubscribe());
          }
          this.cd.detectChanges();
        })
    });
  }

  setFlightMode() {
    this.character.isFlying = !this.character.isFlying;
    if(this.character.isFlying) {
      this.character.location = this.utilsService.toHeightOffset(this.character.location, 195);
    }
    else{
      this.character.location = this.utilsService.toFixedHeight(this.character.location);
    }
    this.gameService.updateServerOnPosition(true);
    const flightSubscription = this.gameService.toggleFlightMode(this.playerId, this.character.isFlying).subscribe(() => flightSubscription.unsubscribe());
  }

  ngOnDestroy() {
    this.flightDataSubscription.unsubscribe();
  }

  calculateRemainingTime(timeInSeconds) {
    // if (timeInSeconds) {
      this.minutes = (Math.floor(timeInSeconds / 60)).toString();
      this.seconds = (timeInSeconds - (+this.minutes * 60)).toString();
    // }
    // else{
    //   this.minutes = '00';
    //   this.seconds = '00';
    //   console.log(timeInSeconds);
    // }
  }

  isPlayerWalking() {
    if (this.movingType === 'walking')
      return true;
    else
      return false;
  }

  isPlayerRunning() {
    if (this.movingType === 'running')
      return true;
    else
      return false;
  }
}
