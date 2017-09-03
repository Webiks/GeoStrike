import { Component, Input } from '@angular/core';
import { AcNotification } from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from '../../../services/utils.service';
import { PlayerState } from "../../../../types";

@Component({
  selector: 'other-players',
  templateUrl: './other-players.component.html',
})
export class OtherPlayersComponent {
  @Input() private playersPositions: Observable<AcNotification>;

  constructor(private utils: UtilsService) {
  }

  getOrientation(location,heading: number, state: PlayerState) {
    if (state === 'DEAD'){
      return this.utils.getOrientation(location, heading,0,90);
    }else{
      return this.utils.getOrientation(location, heading);
    }
    
  }
}
