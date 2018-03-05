import { ChangeDetectorRef, Component, HostListener, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CharacterService } from "../../../services/character.service";
import { Subscription } from "rxjs/Subscription";
import { FlightData, FlightHeight } from "../../../../types";
import { ActionType } from "angular-cesium";
import { GameService } from "../../../services/game.service";
import { UtilsService } from "../../../services/utils.service";
import { FlightModeService } from "./flight-mode.service";


@Component({
  selector: 'flight-mode',
  styleUrls: ['./flight-mode.component.scss'],
  templateUrl: './flight-mode.component.html',
  providers: [FlightModeService]

})
export class FlightModeComponent implements OnInit, OnDestroy {
  @Input() me;
  @Input() username;
  flightDataSubscription: Subscription;
  flightSubscription: Subscription;
  flightData: FlightData;
  playerId: string;
  minutes: string;
  seconds: string;
  movingType: string = 'none';
  flightHeightLevel: FlightHeight = 'NONE';

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
              private utilsService: UtilsService, private flightModeService: FlightModeService) {
  }

  ngOnInit() {

    this.ngZone.runOutsideAngular(() => {
      this.flightDataSubscription = this.gameService.getCurrentGameData()
        .map(result => result.gameData.me)
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
          // if (player.entity.isFlying) {
          if (!this.character.isFlying) {
            this.flightSubscription = this.gameService.toggleFlightMode(this.playerId, false).subscribe(() => this.flightSubscription.unsubscribe());
            this.character.location = this.utilsService.toFixedHeight(this.character.location);
          }
          if (this.flightData.remainingTime) {
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
    this.character.state$.subscribe(state => {
      if (state && state.flight) {
        this.flightHeightLevel = state.flight.heightLevel;
        console.log(this.flightHeightLevel);
      }
      ;
    })
  }

  setFlightMode(isToggleFlight: boolean = false, isFlying: boolean) {
    let updateFlyState = this.flightModeService.changeFlyingState();
    this.gameService.updateServerOnPosition(true);
    if(updateFlyState)
    {
      const flightSubscription = this.gameService.toggleFlightMode(this.character.meFromServer.id, this.character.isFlying).subscribe(() => flightSubscription.unsubscribe());
    }
    // if (isToggleFlight)
    //   this.character.isFlying = !this.character.isFlying;
    // else
    //   this.character.isFlying = isFlying;
    // if (this.character.isFlying) {
    //
    //   this.character.location = this.utilsService.toHeightOffset(this.character.location, 195);
    // }
    // else {
    //   this.character.location = this.utilsService.toFixedHeight(this.character.location);
    // }

  }

  ngOnDestroy() {
    this.flightDataSubscription.unsubscribe();
  }

  calculateRemainingTime(timeInSeconds) {
    this.minutes = (Math.floor(timeInSeconds / 60)).toString();
    this.seconds = (timeInSeconds - (+this.minutes * 60)).toString();
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

  // getFlightHeightGauge(){
  //   // const flightCurrentHeight = this.utilsService.getFlightHeightForGauge(this.character.location);
  //   // return val === flightCurrentHeight;
  //   if(this.character)
  //
  //     // this.flightHeightLevel = this.character.flightData.heightLevel;
  //
  //   this.cd.detectChanges();
  // }
}
