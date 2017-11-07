import { Component, Input } from '@angular/core';
import { AcNotification } from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from '../../../services/utils.service';
import { InterpolationService, InterpolationType } from '../../../services/interpolation.service';
import { PlayerFields, } from '../../../../types';
import { CharacterService, ViewState } from '../../../services/character.service';
import { TakeControlService } from '../../../services/take-control.service';

@Component({
  selector: 'other-players',
  templateUrl: './other-players.component.html',
})
export class OtherPlayersComponent {
  @Input() private playersPositions: Observable<AcNotification>;
  playersPositionMap = new Map<string, any>();
  Cesium = Cesium;

  isOverview$: Observable<boolean>;

  constructor(public utils: UtilsService, public character: CharacterService, private takeControlService: TakeControlService) {
    this.isOverview$ = character.viewState$.map(viewState => viewState === ViewState.OVERVIEW);
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
      const roll = player.character.name !== 'car' ? 90 : 10;
      return this.utils.getOrientation(location, heading, 0, roll);
    } else {
      const playerHeading = player.type === 'PLAYER' ? heading : heading + 90;
      const roll = player.isCrawling ? 85 : 0;
      return this.utils.getOrientation(location, playerHeading, 0, roll);
    }
  }

  getModel(player: PlayerFields.Fragment) {
    return player.character.model;
  }

  getModelScale(player: PlayerFields.Fragment) {
    return player.character.scale;
  }

  getPlayerIcon(player: PlayerFields.Fragment) {
    if (player.state === 'DEAD' && player.character.iconDeadUrl){
      return player.character.iconDeadUrl;
    }
    else if (player.character.iconUrl) {
      return player.character.iconUrl;
    }
    return '/assets/icons/grey-mark.png';
  }

  runAnimation(player: PlayerFields.Fragment) {
    return player.state === 'DEAD';
  }

  getLabelPixelOffset(player: PlayerFields.Fragment) {
    let xOffset = -10;
    xOffset -= player.character.name.length * 2.5;

    return [xOffset, 45];
  }

  getIconColor(player) {
    if (this.takeControlService.selectedPlayerToControl) {
      return player.id === this.takeControlService.selectedPlayerToControl.id ? Cesium.Color.YELLOW : Cesium.Color.WHITE;
    }
    return Cesium.Color.WHITE;
  }

  getPlayerName(player) {
    return player.username ? player.username : '';
  }


}
