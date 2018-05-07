import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GameService } from "../../../services/game.service";
import { TakeControlService } from "../../../services/take-control.service";
import { CharacterService } from "../../../services/character.service";

@Component({
  selector: 'player-details',
  template: `
    <div class="details-container" *ngIf="me">
      <div *ngIf="me?.character?.portraitUrl" class="img-container" [ngClass]="{
       'blue': me?.team === 'BLUE',
       'red': me?.team === 'RED'
     }">
        <img [src]="getPortrait()" alt="" class="img">
      </div>
      <div class="name-life-bar-container">
        <div class="text">{{username}}</div>
        <div class="life-bar-wrapper">
          <div class="life-bar"
               [ngClass]="{'life-bar--full': getlifeStateCondition('FULL'),'life-bar--high': getlifeStateCondition('HIGH'),'life-bar--medium': getlifeStateCondition('MEDIUM'),'life-bar--low': getlifeStateCondition('LOW')}" [style.width.%]="me.lifeStatePerctange">
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./player-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerDetailsComponent implements OnInit, OnChanges {

  viewer = false;
  @Input() me;
  @Input() username;
  lifeState: string;
  lifeStatePerctange: number;

  constructor(private gameService: GameService, private controlledService: TakeControlService, private character: CharacterService) {
  }

  ngOnInit() {
    this.gameService.getCurrentGameData()
      .map(result => result.gameData)
      .subscribe(gameData => {
        if (this.lifeStatePerctange && (this.controlledService.controlledPlayer.id === this.character.meFromServer.id)){
          this.lifeStatePerctange = this.controlledService.controlledPlayer.lifeStatePerctange
          this.lifeState = this.controlledService.controlledPlayer.lifeState;
        }
        else if (this.lifeStatePerctange && (this.controlledService.controlledPlayer.id !== this.character.meFromServer.id)){
          let player = gameData.players.find(x => x.id === this.controlledService.controlledPlayer.id);
          this.lifeStatePerctange = player.lifeStatePerctange
          this.lifeState = player.lifeState;
        }
      })
  }
  getPortrait() {
    const url = this.me && this.me.character && this.me.character.portraitUrl;
    if (url) {
      const urlSplit = url.split('.');
      return `${urlSplit[0]}_right.${urlSplit[1]}`;
    }
    return undefined;
  }

  getlifeStateCondition(condtion: string): Boolean {
    if (this.lifeState === condtion)
      return true;
    else
      return false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.me) {
      this.viewer = this.me['__typename'] === 'Viewer';
      this.lifeState = this.me.lifeState;
      this.lifeStatePerctange = this.me.lifeStatePerctange;
    }
  }

}
