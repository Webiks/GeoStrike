import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
      <div class="text">{{username}}</div>
    </div>
  `,
  styleUrls: ['./player-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerDetailsComponent implements OnInit, OnChanges {

  viewer = false;

  @Input() me;

  @Input() username;

  constructor() {
  }

  getPortrait(){
    const url =  this.me && this.me.character && this.me.character.portraitUrl;
    if (url){
      const urlSplit = url.split('.');
      return `${urlSplit[0]}_right.${urlSplit[1]}`;
    }
    return undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.me) {
      this.viewer = this.me['__typename'] === 'Viewer';
    }
  }

  ngOnInit() {
  }

}
