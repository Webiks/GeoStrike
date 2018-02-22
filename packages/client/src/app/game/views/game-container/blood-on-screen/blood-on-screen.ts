import { Component, Input, NgZone, OnDestroy } from '@angular/core';
import { CharacterService } from "../../../services/character.service";
import { Subscription } from "rxjs/Subscription";
import { ActionType } from "angular-cesium";
import { GameService } from "../../../services/game.service";
import { Subject } from "rxjs/Subject";
import { PlayerLifeState } from "../../../../types";

@Component({
  selector: 'blood-on-screen',
  templateUrl: './blood-on-screen.html',
  styleUrls: ['./blood-on-screen.scss'],
  providers: [CharacterService]
})
export class BloodOnScreen implements OnDestroy {
  showBloodSubscription: Subscription;
  showBlood$: Subject<PlayerLifeState> = new Subject();
  lifePercentage: string;
  @Input() isInShootingPosition = false;

  constructor(private ngZone: NgZone,
              private gameService: GameService) {
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.showBloodSubscription = this.gameService.getCurrentGameData()
        .map(result => result.gameData.me)
        .map(player => {
          return {
            id: player.id,
            actionType: ActionType.ADD_UPDATE,
            entity: player,
          }
        })
        .subscribe(me => {
          this.showBlood$.next(me.entity.lifeState)
          this.showBlood$.subscribe(lifeState => this.lifePercentage = lifeState);
        })
    });
  }

  ngOnDestroy() {
    this.showBloodSubscription.unsubscribe();
  }
}
