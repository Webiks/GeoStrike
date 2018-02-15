import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

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
               [ngClass]="{'life-bar--full': getlifeStateCondtion('FULL'),'life-bar--high': getlifeStateCondtion('HIGH'),'life-bar--medium': getlifeStateCondtion('MEDIUM'),'life-bar--low': getlifeStateCondtion('LOW')}" [style.width.%]="me.lifeStatePerctange">
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

  constructor() {
  }

  getPortrait() {
    const url = this.me && this.me.character && this.me.character.portraitUrl;
    if (url) {
      const urlSplit = url.split('.');
      return `${urlSplit[0]}_right.${urlSplit[1]}`;
    }
    return undefined;
  }

  getlifeStateCondtion(condtion: string): Boolean {
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

  ngOnInit() {
  }

}
