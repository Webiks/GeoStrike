import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActionType, CesiumService } from 'angular-cesium';
import { CharacterService, CharacterState, MeModelState, ViewState } from '../../../services/character.service';
import { UtilsService } from '../../../services/utils.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { GameService } from '../../../services/game.service';
import { CharacterData } from '../../../../types';
import { BasicDesc } from 'angular-cesium/src/angular-cesium/services/basic-desc/basic-desc.service';
import { OtherPlayerEntity } from '../../game-container/game-container.component';
import { KeyboardKeysService } from '../../../../core/services/keyboard-keys.service';
import { MatSnackBar } from '@angular/material';
import { SnackBarContentComponent } from '../../../../shared/snack-bar-content/snack-bar-content.component';
import { SoundService } from '../../../services/sound.service';
import { InterpolationService, InterpolationType } from "../../../services/interpolation.service";
import { FlightModeService } from "../../game-container/flight-mode/flight-mode.service";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit, OnDestroy {

  private meModelDrawSubscription: Subscription;
  @Input() me;
  @ViewChild('cross') crossElement: ElementRef;
  @ViewChild('muzzleFlash') muzzleFlash: ElementRef;
  @ViewChild('meModel') meModel: BasicDesc;

  showWeapon$: Subscription;
  showWeapon = false;
  showCross$: Subscription;
  showCross = false;
  isInShootingPosition$: Subscription;
  isInShootingPosition = false;
  shootSub$: Subscription;
  buildingNearby = false;
  canExitBuilding = false;
  flightAlertDisplayedOnce = false;
  flightLandAlertDisplayedOnce = false;
  crashAlertDisplayedOnce = false;
  transparentColor = new Cesium.Color(0, 0, 0, 0.0001);
  normalColor = new Cesium.Color(1, 1, 1, 1);
  ViewState = ViewState;
  Cesium = Cesium;
  playersPositionMap = new Map<string, any>();
  increase = true;
  intervalId;
  playerInFlightModeNotFlying = false;
  isFlightInPlace: boolean = false;
  isPlayerMoving: boolean = false;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    // if (event.keyCode == 70 && !this.character.isFlying) {
    //   this.playerInFlightModeNotFlying = true;
    //   this.setSlowlyMovingForward();
    // }
    // if (event.keyCode == 70 && this.character.isFlying) {
    //   this.playerInFlightModeNotFlying = false;
    //   clearInterval(this.intervalId);
    // }
    // if (event.shiftKey && event.keyCode == 87) {
    //   this.playerInFlightModeNotFlying = false;
    //   clearInterval(this.intervalId);
    // }
    if (event.key === 'w') {
      this.playerInFlightModeNotFlying = true;
      // clearInterval(this.intervalId);
    }
  }
  //
  @HostListener('document:keyup', ['$event']) onKeyupHandler(event: KeyboardEvent) {
    if (event.key === 'w') {
      this.playerInFlightModeNotFlying = false;
    }
    //   if (event.shiftKey && event.keyCode == 87 && this.character.isFlying) {
    //     this.playerInFlightModeNotFlying = true;
    //     this.setSlowlyMovingForward();
    //   }
    // }
  }

  constructor(private character: CharacterService,
              public utils: UtilsService,
              private cesiumService: CesiumService,
              private gameService: GameService,
              private keyboardKeysService: KeyboardKeysService,
              private ngZone: NgZone,
              private snackBar: MatSnackBar,
              private soundService: SoundService,
              private cd: ChangeDetectorRef,
              private flightService: FlightModeService) {
  }

  get notifications$() {
    return this.character.state$.filter(f => f !== null).map(meState => ({
      actionType: ActionType.ADD_UPDATE,
      id: meState.id,
      entity: meState,
    }));
  }

  setShootEvent() {
    this.keyboardKeysService.registerKeyBoardEventDescription('LeftMouse', 'Shoot');
    const enterSub$ = Observable.create((observer) => {
      this.keyboardKeysService.registerKeyBoardEvent('Enter', 'Shoot', () => {
        observer.next();
      });
    });
    this.shootSub$ = Observable.fromEvent(document.body, 'click')
      .filter(() => !!document.pointerLockElement)
      .merge(enterSub$)
      .filter(() => this.character.state === MeModelState.SHOOTING)
      .do(() => this.gameService.notifyShot(this.character.meFromServer.id, this.character.location))
      .subscribe((e: MouseEvent) => {
        this.showGunMuzzleFlash();
        this.soundService.gunShot();
        const crossElement = this.crossElement.nativeElement;
        const crossLocation = {
          x: crossElement.x + crossElement.width / 2,
          y: crossElement.y + crossElement.height / 2,
        };
        const picked = this.cesiumService.getScene().pick(crossLocation);
        if (picked && picked.id && picked.id.acEntity && picked.id.acEntity instanceof OtherPlayerEntity) {
          const shotedEntity = picked.id.acEntity;
          let killSubscription;
          killSubscription = this.gameService.notifyBeenShot(shotedEntity.id)
            .subscribe(beenShotData => {
              this.setKillEvent(beenShotData.data.notifyBeenShot.lifeState, shotedEntity.id)
              killSubscription.unsubscribe()
            });
        }
      });
  }

  setKillEvent(lifeState: string, shotedEntityId) {
    if (lifeState === "EMPTY") {
      let killSubscription = this.gameService.notifyKill(shotedEntityId)
        .subscribe(() => killSubscription.unsubscribe());
    }
  }

  ngOnInit(): void {
    this.showWeapon$ = Observable.combineLatest(
      this.character.viewState$.map(viewState => viewState === ViewState.FPV),
      this.character.state$.map(meState => meState && meState.state === MeModelState.SHOOTING)
    ).map((result => result[0] || result[1])).subscribe((value) => {
      this.showWeapon = value;
      this.cd.detectChanges();
    });
    this.showCross$ = this.character.state$.map(meState => meState && meState.state === MeModelState.SHOOTING).subscribe((value) => {
      this.showCross = value;
      this.cd.detectChanges();
    });
    this.isInShootingPosition$ = this.character.viewState$.map(viewState => viewState === ViewState.FPV).subscribe((x) => {
      this.isInShootingPosition = x;
      this.cd.detectChanges();
    })
    this.meModelDrawSubscription = this.meModel.onDraw.subscribe(entity => {
      this.character.entity = entity.cesiumEntity;
    });

    this.setShootEvent();
    this.character.state$.subscribe(state => {
      if (state && !state.enteredBuilding && this.buildingNearby !== !!state.nearbyBuildingPosition) {
        this.buildingNearby = !!state.nearbyBuildingPosition;
        if (this.buildingNearby) {
          this.ngZone.run(() => {
            this.snackBar.dismiss();
            this.snackBar.openFromComponent(SnackBarContentComponent, {
              data: `Press E to Enter Building`,
              duration: 3000,
            });
          });
        }
        else {
          this.ngZone.run(() => this.snackBar.dismiss());
        }
      }

      if (state && this.canExitBuilding !== state.canExitBuilding) {
        this.canExitBuilding = state.canExitBuilding;
        if (this.canExitBuilding) {
          this.ngZone.run(() => {
            this.snackBar.dismiss();
            this.snackBar.openFromComponent(SnackBarContentComponent, {
              data: `Press E to Exit Building`,
              duration: 3000,
            });
          });
        }
        else {
          this.ngZone.run(() => this.snackBar.dismiss());
        }
      }
      if (state && state.isFlying && state.flight && state.flight.remainingTime) {
        if (!this.crashAlertDisplayedOnce) {
          if (state.flight.remainingTime <= 30) {
            this.crashAlertDisplayedOnce = true;
            this.ngZone.run(() => {
              this.snackBar.dismiss();
              this.snackBar.openFromComponent(SnackBarContentComponent, {
                data: `<div style="display: flex;flex-direction: row;justify-content:space-between">
                        <img src="/assets/icons/red-alert.svg" style="margin-right: 10px;">
                        <div style="display: flex;flex-direction: column;">
                            <div>The jetpack fuel tank is almost empty!</div>
                            <div> Land now or you'll crash to death</div>
                       </div>
                    </div>`,
                duration: 3000,
              });
            });
          }
        }
        if (!this.flightAlertDisplayedOnce) {
          this.flightAlertDisplayedOnce = true;
          this.ngZone.run(() => {
            this.snackBar.dismiss();
            this.snackBar.openFromComponent(SnackBarContentComponent, {
              data: `<div style="display: flex;flex-direction: row;justify-content:space-between">
                        <img src="/assets/icons/red-alert.svg" style="margin-right: 10px;">
                        <div style="display: flex;flex-direction: column;">
                            <div>Avoid crashing by reaching the ground with</div>
                            <div> minimal speed before your flight time is over</div>
                       </div>
                    </div>`,
              duration: 3000,
            });
          });
        }
        if (state.flight.heightLevel === 'A' && !this.flightLandAlertDisplayedOnce) {
          this.flightLandAlertDisplayedOnce = true;
          this.ngZone.run(() => {
            this.snackBar.dismiss();
            this.snackBar.openFromComponent(SnackBarContentComponent, {
              data: `Press F to land and exit flight mode`,
              duration: 3000,
            });
          });
        }
        if (state.flight.heightLevel !== 'A') {
          this.flightLandAlertDisplayedOnce = false;
        }
      }
    });

    this.flightService.currentFlightMode.subscribe(isFlightInPlace => {
      this.isFlightInPlace = isFlightInPlace;
      if (this.isFlightInPlace)
        this.setSlowlyMovingForward();
      // else
      //   clearInterval(this.intervalId);
    });
    this.flightService.currentMovingMode.subscribe( isPlayerMoving => {
      this.isPlayerMoving = isPlayerMoving;
    } )
  }

  ngOnDestroy(): void {
    this.shootSub$.unsubscribe();
    this.meModelDrawSubscription.unsubscribe();
    this.showCross$.unsubscribe();
    this.showWeapon$.unsubscribe();
  }

  private showGunMuzzleFlash() {
    this.muzzleFlash.nativeElement.style.visibility = 'visible';
    setTimeout(() => this.muzzleFlash.nativeElement.style.visibility = 'hidden', 20);
  }

  canvasPropagation() {
    this.cesiumService.getViewer().canvas.click();
  }

  getOrientation(location, heading: number, player: CharacterState) {
    if (this.showMeModel()) {
      if (player.state === MeModelState.DEAD) {
        return this.utils.getOrientation(location, heading, 0, 90);
      } else {
        const roll = this.character.isCrawling ? 90 : ((this.character.isFlying) ? (45) : 0);
        return this.utils.getOrientation(location, heading, 0, roll);
      }
    }
  }

  get characterInfo(): CharacterData {
    return this.character.currentStateValue.characterInfo || {} as CharacterData;
  }

  getColor() {
    if (this.character.viewState === ViewState.FPV) {
      return this.transparentColor;
    }
    return this.normalColor;
  }

  showMeModel() {
    return this.character.viewState !== ViewState.OVERVIEW && this.character.state !== MeModelState.CONTROLLED;
  }

  getPosition(position) {
    const cart = Cesium.Cartographic.fromCartesian(position);
    if (this.character.state === MeModelState.DEAD) {
      return position;
    } else if (this.character.isCrawling) {
      return this.utils.toHeightOffset(position, 0.2);
    } else if (this.characterInfo.fixedHeight) {
      return this.utils.toHeightOffset(position, this.characterInfo.fixedHeight);
    }
    else if (this.character.isFlying) {
      return position;
    }
    return position;
  }

  private fixPosition(position, player) {
    if (player.state === 'DEAD') {
      return position;
    } else if (player.isCrawling) {
      return this.utils.toHeightOffset(position, 0.2);
    } else if (player.characterInfo.fixedHeight) {
      return this.utils.toHeightOffset(position, player.characterInfo.fixedHeight);
    }
    return position;
  }

  interpolatePlayerPosition(player, playerPosition) {
    const playerId = player.id;
    const positionProperty = this.playersPositionMap.get(playerId);
    if (!positionProperty) {
      const result = InterpolationService.interpolate({
        data: playerPosition,
      }, InterpolationType.POSITION);
      this.playersPositionMap.set(playerId, result);
      return result;
    }
    else {
      return InterpolationService.interpolate({
        data: playerPosition,
        cesiumSampledProperty: positionProperty,
      });
    }
  }

  setFlightVibrations() {
      let vibrationHeightMeters = this.character.viewState === ViewState.SEMI_FPV ? 0.3 : 1;
      let location = this.character.location;
      if (this.increase) {
        this.character.location = this.utils.toHeightOffset(location, vibrationHeightMeters)
        this.increase = !this.increase;
      }
      else {
        this.character.location = this.utils.toHeightOffset(location, -vibrationHeightMeters)
        this.increase = !this.increase;
      }
  }

  setSlowlyMovingForward() {
    if (this.character.location) {
      const speed = environment.movement.walkingSpeed;
      const nextLocation = this.utils.pointByLocationDistanceAndAzimuthAndHeight3d(
        this.character.location,
        speed,
        Cesium.Math.toRadians(this.character.heading + 180),
        true
      );
      this.character.location = nextLocation;
    }
  }

  isPlayerInFlightModeNotFlying(me) {
    if (this.character.isFlying && this.isFlightInPlace) {
      return this.interpolatePlayerPosition(me, me.location);
    }
    else {
      return this.getPosition(me.location);
    }
  }
  detectIfPlayerMoving(){
    return this.isPlayerMoving;
  }
}
