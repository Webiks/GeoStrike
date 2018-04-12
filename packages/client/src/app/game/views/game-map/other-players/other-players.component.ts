import { Component, Input } from "@angular/core";
import { AcNotification, CesiumService } from "angular-cesium";
import { Observable } from "rxjs/Observable";
import { UtilsService } from "../../../services/utils.service";
import {
  InterpolationService,
  InterpolationType
} from "../../../services/interpolation.service";
import { PlayerFields } from "../../../../types";
import {
  CharacterService,
  ViewState
} from "../../../services/character.service";
import { TakeControlService } from "../../../services/take-control.service";
import { OtherPlayersShotService } from "./gun-shot/other-players-shot.service";
import { GameService } from "../../../services/game.service";

@Component({
  selector: "other-players",
  templateUrl: "./other-players.component.html",
  providers: [OtherPlayersShotService]
})
export class OtherPlayersComponent {
  @Input() private playersPositions: Observable<AcNotification>;
  playersPositionMap = new Map<string, any>();
  Cesium = Cesium;

  isOverview$: Observable<boolean>;
  terrainType: string;


  constructor(
    public utils: UtilsService,
    public character: CharacterService,
    private takeControlService: TakeControlService,
    private cesiumService: CesiumService,
    private gameService: GameService
  ) {
    this.isOverview$ = character.viewState$.map(
      viewState => viewState === ViewState.OVERVIEW
    );
    this.gameService.currentTerrainEnviorment.subscribe(terrainType => this.terrainType = terrainType);
   // this.modelsAnimation();
  }
  // testTerrainIsReady(){
  //   this.isTerrainReady = true
  // }
  fixPosition(position, player: PlayerFields.Fragment) {
    if (player.state === "DEAD") {
      return position;
    } else if (player.isCrawling) {
      return this.utils.toHeightOffset(position, 0.2);
    } else if (player.character.fixedHeight) {
      return this.utils.toHeightOffset(position, player.character.fixedHeight);
    }
    return position;
  }

  // modelsAnimation(){
  //   const scene = this.cesiumService.getScene();
  //   Cesium.when(scene.readyPromise).then((model)=>{
  //     model.activeAnimations.addAll({
  //       loop : Cesium.ModelAnimationLoop.REPEAT
  //     });
  //   })
  // }

  // interpolatePlayerPosition(player: PlayerFields.Fragment, playerPosition) {
  //   const playerId = player.id;
  //   const fixedPosition = this.fixPosition(playerPosition, player);
  //   const positionProperty = this.playersPositionMap.get(playerId);
  //   if (!positionProperty) {
  //     const result = InterpolationService.interpolate({
  //       data: fixedPosition,
  //     }, InterpolationType.POSITION);
  //     this.playersPositionMap.set(playerId, result);
  //     return result;
  //   }
  //   else {
  //     return InterpolationService.interpolate({
  //       data: fixedPosition,
  //       cesiumSampledProperty: positionProperty,
  //     });
  //   }
  // }

  interpolatePlayerPosition(player: PlayerFields.Fragment, playerPosition) {
    const playerId = player.id;
    const fixedPosition = this.fixPosition(playerPosition, player);
    const result = InterpolationService.interpolate(
      {
        data: fixedPosition
      },
      InterpolationType.POSITION
    );
    this.playersPositionMap.set(playerId, result);
    return result;
  }

  getOrientation(location, heading: number, player: PlayerFields.Fragment) {
    if (player.state === "DEAD") {
      const roll = player.character.name !== "car" ? 90 : 10;
      return this.utils.getOrientation(location, heading, 0, roll);
    } else {
      const playerHeading = player.type === "PLAYER" ? heading : heading + 90;
      const roll = player.isCrawling ? 90 : 0;
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
    const url = player.character && player.character.iconUrl;
    if (url) {
      const urlSplit = url.split(".");
      let postfix = "";
      if (player.state === "DEAD") {
        postfix = "-dead";
      } else if (
        this.takeControlService.selectedPlayerToControl &&
        player.id === this.takeControlService.selectedPlayerToControl.id
      ) {
        postfix += "-chosen";
      }
      if (player.isMe) {
        postfix += "-me";
      }

      return `${urlSplit[0]}${postfix}.${urlSplit[1]}`;
    } else {
      return "/assets/icons/grey-mark.png";
    }
  }

  runAnimation(player: PlayerFields.Fragment) {
    return player.state === "DEAD";
  }

  getLabelPixelOffset(player: PlayerFields.Fragment) {
    let xOffset = -10;
    xOffset -= player.character.name.length * 2.5;

    return [xOffset, 45];
  }

  getPositiveInfinity(){
   let num= new Number();
   num = Number.POSITIVE_INFINITY;
   return num;
  }

  getPlayerName(player) {
    return player.username ? player.username : "";
  }
}
