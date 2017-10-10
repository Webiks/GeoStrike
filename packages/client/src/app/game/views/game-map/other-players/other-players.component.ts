import { Component, Input } from '@angular/core';
import { AcNotification } from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from '../../../services/utils.service';
import { InterpolationService, InterpolationType } from '../../../services/interpolation.service';
import { PlayerFields } from '../../../../types';
import { CharacterService } from '../../../services/character.service';

@Component({
  selector: 'other-players',
  templateUrl: './other-players.component.html',
})
export class OtherPlayersComponent {
  @Input() private playersPositions: Observable<AcNotification>;
  playersPositionMap = new Map<string, any>();
  Cesium = Cesium;

  constructor(public utils: UtilsService, public character: CharacterService) {
  }

  interpolatePlayerPosition(playerId, playerPosition) {
    const positionProperty = this.playersPositionMap.get(playerId);
    if (!positionProperty) {
      const result = InterpolationService.interpolate({
        data: playerPosition,
      }, InterpolationType.POSITION);
      this.playersPositionMap.set(playerId, result);
      return result;
    }
    else {
      return InterpolationService.interpolate({
        data: playerPosition,
        cesiumSampledProperty: positionProperty,
      });
    }
  }

  getOrientation(location, heading: number, player: PlayerFields.Fragment) {
    if (player.state === 'DEAD') {
      return this.utils.getOrientation(location, heading, 0, 90);
    } else {
      const playerHeading = player.type === 'PLAYER' ? heading : heading + 90;
      return this.utils.getOrientation(location, playerHeading);
    }
  }

  getModel(player: PlayerFields.Fragment) {
    return player.character.model;
  }

  getModelScale(player: PlayerFields.Fragment) {
    return player.character.scale;
  }

  getPlayerIcon(player: PlayerFields.Fragment){
    if (player.character.iconUrl){
      return player.character.iconUrl;
    }
    return '/assets/icons/grey-mark.png';
  }

  runAnimation(player: PlayerFields.Fragment) {
    return player.state === 'DEAD';
  }

  getIconPic(player: PlayerFields.Fragment) {
    return player.team === 'BLUE' ? '/assets/icons/blue-mark.png' : '/assets/icons/red-mark.png';
  }

  getLabelPixelOffset(player: PlayerFields.Fragment){
    let xOffset = -10;
    xOffset -= player.character.name.length * 2.5;

    return [xOffset, 45];
  }


}
