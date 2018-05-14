import { ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subscription } from "rxjs/Subscription";
import { GameService } from "../../../services/game.service";
import { BeenShotService } from "./been-shot.service";
import { TakeControlService } from "../../../services/take-control.service";
import { CharacterService } from "../../../services/character.service";

@Component({
  selector: 'blood-on-screen',
  templateUrl: './blood-on-screen.html',
  styleUrls: ['./blood-on-screen.scss']
})
export class BloodOnScreen implements OnDestroy, OnChanges {
  showBloodSubscription: Subscription;
  lifePercentage: string;
  @Input() isInShootingPosition = false;
  viewer;

  constructor(private ngZone: NgZone,
              private gameService: GameService,
              private cd: ChangeDetectorRef,
              private beenShotService: BeenShotService,
              private controlledService: TakeControlService,
              private character: CharacterService
  ) {
  }
  ngOnInit() {
    this.gameService.getCurrentGameData()
      .map(result => result.gameData)
      .subscribe(gameData => {
        if(this.character.meFromServer && this.controlledService.controlledPlayer){
        if (this.lifePercentage && (this.controlledService.controlledPlayer.id === this.character.meFromServer.id)){
          this.lifePercentage = this.controlledService.controlledPlayer.lifeState
        }
        else if (this.lifePercentage && (this.controlledService.controlledPlayer.id !== this.character.meFromServer.id)){
          let player = gameData.players.find(x => x.id === this.controlledService.controlledPlayer.id);
          this.lifePercentage = player.lifeState;
        }
        }
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
  ngOnChanges(changes: SimpleChanges): void {
    if (this.controlledService.controlledPlayer) {
      this.viewer = this.controlledService.controlledPlayer['__typename'] === 'Viewer';
      this.lifePercentage = this.controlledService.controlledPlayer.lifeState;
    }
  }
}
