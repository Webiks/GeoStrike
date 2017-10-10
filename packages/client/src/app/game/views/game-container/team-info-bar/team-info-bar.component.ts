import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PlayerFields } from '../../../../types';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'team-info-bar',
  templateUrl: './team-info-bar.component.html',
  styleUrls: ['./team-info-bar.component.scss']
})
export class TeamInfoBarComponent implements OnInit {
  @Input()
  players: Observable<PlayerFields.Fragment[]>;

  @Input()
  changeDirection = false;

  playersInfo: PlayerFields.Fragment[];

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.players.subscribe(players => {
      this.playersInfo = players;
      this.cd.detectChanges();
    })
  }

}
