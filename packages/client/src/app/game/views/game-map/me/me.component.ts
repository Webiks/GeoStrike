import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionType, CesiumService } from 'angular-cesium';
import { CharacterService, CharacterState, MeModelState, ViewState } from '../../../services/character.service';
import { UtilsService } from '../../../services/utils.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { GameService } from '../../../services/game.service';
import { CharacterData } from '../../../../types';


@Component({
  selector: 'me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
})
export class MeComponent implements OnInit, OnDestroy {

  @ViewChild('cross') crossElement: ElementRef;
  @ViewChild('gunShotSound') gunShotSound: ElementRef;
  @ViewChild('muzzleFlash') muzzleFlash: ElementRef;

  showWeapon$: Observable<boolean>;
  showCross$: Observable<boolean>;
  clickSub$: Subscription;
  ViewState = ViewState;
  buildingNearby = false;
  insideBuilding = false;

  constructor(private character: CharacterService,
              public utils: UtilsService,
              private cesiumService: CesiumService,
              private gameService: GameService,
              private cd: ChangeDetectorRef) {
  }

  get notifications$() {
    return this.character.state$.filter(f => f !== null).map(meState => ({
      actionType: ActionType.ADD_UPDATE,
      id: meState.id,
      entity: meState,
    }));
  }

  setShootEvent() {
    this.clickSub$ = Observable.fromEvent(document.body, 'click')
      .filter(() => this.character.state === MeModelState.SHOOTING)
      .subscribe((e: MouseEvent) => {
        this.showGunMuzzleFlash();
        this.soundGunFire();
        const crossElement = this.crossElement.nativeElement;
        const crossLocation = {
          x: crossElement.x + crossElement.width / 2,
          y: crossElement.y + crossElement.height / 2,
        };
        const picked = this.cesiumService.getScene().pick(crossLocation);
        if (picked && picked.id && picked.id.acEntity) {
          const shotedEntity = picked.id.acEntity;
          const killSubscription = this.gameService.notifyKill(shotedEntity.id)
            .subscribe(() => killSubscription.unsubscribe());
        }
      });
  }

  ngOnInit(): void {
    this.showWeapon$ = Observable.combineLatest(
      this.character.viewState$.map(viewState => viewState === ViewState.FPV),
      this.character.state$.map(meState => meState && meState.state === MeModelState.SHOOTING))
      .map((result => result[0] || result[1]));
    this.showCross$ = this.character.state$.map(meState => meState && meState.state === MeModelState.SHOOTING);
    this.setShootEvent();
    this.character.state$.subscribe(state => {
      if (state && this.buildingNearby !== !!state.nearbyBuildingPosition) {
        this.buildingNearby = !!state.nearbyBuildingPosition;
        this.cd.detectChanges();
      }
      if (state && this.insideBuilding !== !!state.enteredBuilding) {
        this.insideBuilding = !!state.enteredBuilding;
        this.cd.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.clickSub$.unsubscribe();
  }

  private soundGunFire() {
    const soundElement = this.gunShotSound.nativeElement;
    soundElement.currentTime = 0;
    soundElement.play();
  }

  private showGunMuzzleFlash() {
    this.muzzleFlash.nativeElement.style.visibility = 'visible';
    setTimeout(() => this.muzzleFlash.nativeElement.style.visibility = 'hidden', 20);
  }

  canvasPropagation() {
    this.cesiumService.getViewer().canvas.click();
  }

  getIconPic(player) {
    return player.team === 'BLUE' ? '/assets/icons/blue-mark.png' : '/assets/icons/red-mark.png';
  }

  getOrientation(location, heading: number, player: CharacterState) {
    if (player.state === MeModelState.DEAD) {
      return this.utils.getOrientation(location, heading, 0, 90);
    } else {
      return this.utils.getOrientation(location, heading);
    }
  }

  get characterInfo(): CharacterData {
    return this.character.currentStateValue.characterInfo;
  }
}
