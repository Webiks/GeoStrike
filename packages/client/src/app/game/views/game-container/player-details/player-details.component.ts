import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'player-details',
  template: `
    <div class="details-container" *ngIf="me">
      <div *ngIf="!viewer" class="img-container" [ngClass]="{
       'blue': me?.team === 'BLUE',
       'red': me?.team === 'RED'
     }">
        <img [src]="me?.character?.portraitUrl" alt="" class="img">
      </div>
      <div *ngIf="!viewer" class="text">{{me?.username}}</div>
      <div *ngIf="viewer" class="text">VIEWER</div>
    </div>
  `,
  styleUrls: ['./player-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerDetailsComponent implements OnInit, OnChanges {

  viewer = false;

  @Input() me;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.me) {
      this.viewer = this.me['__typename'] === 'Viewer';

    }
  }

  ngOnInit() {

  }

}
