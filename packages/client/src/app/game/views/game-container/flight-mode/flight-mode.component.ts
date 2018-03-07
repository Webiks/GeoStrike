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
  initFlightSubscription: Subscription;
  flightData: FlightData;
  playerId: string;
  minutes: string;
  seconds: string;
  movingType: string = 'none';
  flightHeightLevel: FlightHeight = 'NONE';
  currentFlightHeight: number;
  dangerousRemainingTime = 30;

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

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    if(this.flightSubscription)
      this.flightSubscription = this.gameService.toggleFlightMode(this.character.meFromServer.id, false).subscribe(() => this.flightSubscription.unsubscribe());
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    if(this.flightSubscription)
      this.flightSubscription = this.gameService.toggleFlightMode(this.character.meFromServer.id, false).subscribe(() => this.flightSubscription.unsubscribe());
  }

  constructor(private character: CharacterService,
              private gameService: GameService,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef,
              private utilsService: UtilsService,
              private flightModeService: FlightModeService) {
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
          const cart = Cesium.Cartographic.fromCartesian(this.character.location);
          this.currentFlightHeight = cart.height;
          this.playerId = player.id;
          if (!this.character.isFlying) {
            // this.initFlightSubscription = this.gameService.toggleFlightMode(this.playerId, false).subscribe(() => this.initFlightSubscription.unsubscribe());
            // if(!this.flightSubscription)
            //   this.gameService.toggleFlightMode(this.playerId, false).subscribe( () => console.log("yay"));
            this.character.location = this.utilsService.toFixedHeight(this.character.location);
          }
          else if (Number.isNaN(Number(this.currentFlightHeight)) || Math.floor(this.currentFlightHeight) === 0) {
            this.setCrash();
          }
          if (this.flightData.remainingTime) {
            this.calculateRemainingTime(this.flightData.remainingTime);
          }
          else {
            this.setCrash();
          }
          this.cd.detectChanges();
        })
    });
    this.character.state$.subscribe(state => {
      if (state && state.flight) {
        this.flightHeightLevel = state.flight.heightLevel;
        console.log(this.flightHeightLevel);
      }
    })
  }

  setFlightMode(isToggleFlight: boolean = false, isFlying: boolean) {
    let updateFlyState = this.flightModeService.changeFlyingState();
    this.gameService.updateServerOnPosition(true);
    if (updateFlyState) {
       this.flightSubscription = this.gameService.toggleFlightMode(this.character.meFromServer.id, this.character.isFlying).subscribe(() => this.flightSubscription.unsubscribe());
    }
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

  setCrash() {
    this.minutes = '00';
    this.seconds = '00';
    let crashSubscription;
    setTimeout(() => crashSubscription = this.gameService.notifyCrash(this.playerId)
      .subscribe(() => crashSubscription.unsubscribe()), 2000);
  }
}
