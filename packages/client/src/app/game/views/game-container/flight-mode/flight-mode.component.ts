import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  NgZone, OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { CharacterService } from "../../../services/character.service";
import { Subscription } from "rxjs/Subscription";
import { FlightData, FlightHeight } from "../../../../types";
import { GameService } from "../../../services/game.service";
import { UtilsService } from "../../../services/utils.service";
import { FlightModeService } from "./flight-mode.service";

@Component({
  selector: 'flight-mode',
  styleUrls: ['./flight-mode.component.scss'],
  templateUrl: './flight-mode.component.html',
  providers: [FlightModeService]

})

export class FlightModeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() me;
  @Input() username;
  flightDataSubscription: Subscription;
  flightSubscription: Subscription;
  viewerSubscription: Subscription;
  flightData: FlightData;
  playerId: string;
  minutes: string;
  seconds: string;
  movingType: string = 'none';
  flightHeightLevel: FlightHeight = 'NONE';
  currentFlightHeight: number;
  dangerousRemainingTime = 30;
  viewer = false;

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

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    if (this.flightSubscription)
      this.flightSubscription = this.gameService.toggleFlightMode(this.character.meFromServer.id, false).subscribe(() => this.flightSubscription.unsubscribe());
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    if (this.flightSubscription)
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
        .map(result => result.gameData)
        .subscribe(gameData => {
          if (this.flightData && (this.me.id === this.character.meFromServer.id)) {
            const cart = Cesium.Cartographic.fromCartesian(this.character.location);
            this.currentFlightHeight = cart.height;
            this.playerId = this.me.id;
            if (!this.character.isFlying) {
              this.character.location = this.utilsService.toFixedHeight(this.character.location);
            }
            else if (Number.isNaN(Number(this.currentFlightHeight)) || Math.floor(this.currentFlightHeight) === 0) {
              this.setCrash();
            }
            if (this.flightData && this.flightData.remainingTime) {
              this.calculateRemainingTime(this.flightData.remainingTime);
            }
            else if (this.character.isFlying) {
              this.setCrash();
            }
          }
          else if (this.flightData && (this.me.id !== this.character.meFromServer.id)) {
            let player = gameData.players.find(x => x.id === this.me.id);
            this.calculateRemainingTime(player.flight.remainingTime);
          }
          this.cd.detectChanges();
        })
    });
    this.character.state$.subscribe(state => {
      if (state && state.flight) {
        this.flightHeightLevel = state.flight.heightLevel;
      }
    })
  }

  changeFlyingState() {
    let updateFlyState = this.flightModeService.changeFlyingState();
    this.gameService.updateServerOnPosition(true);
    if (updateFlyState) {
      let flightData = this.character.flightData ? this.character.flightData : this.character.meFromServer.flight;
      this.flightData = flightData;
      this.flightHeightLevel = this.utilsService.calculateHeightLevel(flightData, this.character.location, 50);
      this.flightData.heightLevel = this.flightHeightLevel;
      const flightSubscription = this.gameService.toggleFlightMode(this.me.id, this.character.isFlying).subscribe(() => flightSubscription.unsubscribe());
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.me) {
      this.viewer = this.me['__typename'] === 'Viewer';
      this.flightData = this.me.flight;
      if (this.flightData) {
        this.calculateRemainingTime(this.flightData.remainingTime);
      }
    }
  }
}
