import { ChangeDetectorRef, Component, Input, NgZone, OnDestroy } from '@angular/core';
import { CharacterService, ViewState } from "../../../services/character.service";
import { Subscription } from "rxjs/Subscription";
import { ActionType } from "angular-cesium";
import { GameService } from "../../../services/game.service";
import { Subject } from "rxjs/Subject";
import { GunShots, PlayerLifeState } from "../../../../types";
import { gunShotSubscription } from "../../../../graphql/gun-shot.subscription";
import { Observable } from "rxjs/Observable";
import { BeenShotService } from "./been-shot.service";

@Component({
  selector: 'blood-on-screen',
  templateUrl: './blood-on-screen.html',
  styleUrls: ['./blood-on-screen.scss'],
  providers: [CharacterService, BeenShotService]
})
export class BloodOnScreen implements OnDestroy {
  showBloodSubscription: Subscription;
  // showBlood$: Subject<PlayerLifeState> = new Subject();
  lifePercentage: string;
  @Input() isInShootingPosition = false;

  constructor(private ngZone: NgZone,
              private gameService: GameService,
              private cd: ChangeDetectorRef,
              private beenShotService: BeenShotService
  ) {
  }

  ngOnInit() {
    this.gameService.getCurrentGameData()
      .map(result => result.gameData.me)
      .map(player => {
        return {
          id: player.id,
          actionType: ActionType.ADD_UPDATE,
          entity: player,
        }
      })
      .subscribe(me => {
        this.lifePercentage = me.entity.lifeState
      })
      this.ngZone.runOutsideAngular(() => {
        this.showBloodSubscription = this.beenShotService.subscribeToBeenShot().subscribe((data) => {
          this.lifePercentage = data.beenShot.lifeState;
          this.cd.detectChanges();
        })
      })
    }

  ngOnDestroy() {
    this.showBloodSubscription.unsubscribe();
  }
}


/*

  public subscribeToGunShot(): Observable<GunShots.Subscription> {

    if (!this.gunShots$) {
      this.gunShots$ = this.apollo.subscribe({
        query: gunShotSubscription,
      }).share();
    }
    return this.gunShots$;
  }

 */
