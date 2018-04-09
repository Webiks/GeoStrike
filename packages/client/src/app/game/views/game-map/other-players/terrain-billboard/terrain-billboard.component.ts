import { Component, Input, OnInit } from '@angular/core';
import { GameService } from "../../../../services/game.service";
import { AcNotification, CesiumService } from "angular-cesium";
import { UtilsService } from "../../../../services/utils.service";
import { PlayerFields } from "../../../../../types";
import { TakeControlService } from "../../../../services/take-control.service";
import { CharacterService, ViewState } from "../../../../services/character.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'terrain-billboard',
  templateUrl: './terrain-billboard.component.html',
  styleUrls: ['./terrain-billboard.component.scss']
})
export class TerrainBillboardComponent implements OnInit {

  @Input() private playersPositions: Observable<AcNotification>;
  terrainView: string;
  isOverview$: Observable<boolean>;

  constructor(private gameService: GameService, private cesiumService: CesiumService, private utilsService: UtilsService, private takeControlService: TakeControlService, private character: CharacterService) {
    this.isOverview$ = character.viewState$.map(viewState => viewState === ViewState.OVERVIEW);
  }

  ngOnInit() {
    //
    // this.playersPositions.subscribe(player => {
    //   this.cesiumService.getViewer().entities.removeAll();
    //   this.setBillboard(player.entity);
    // })
    // this.getTerrainType();
    // this.gameService.currentTerrainEnviorment.subscribe(terrainType => {
    //   if( terrainType !== 'URBAN' && this.isOverview$){
    //     this.playersPositions.forEach(player => {
    //       this.setBillboard(player.entity);
    //     })
    //   }
    // })
  }

  // getTerrainType() {
  //   this.gameService.currentTerrainEnviorment.subscribe(terrainType => {
  //     this.terrainView = terrainType;
  //   })
  // }

  setBillboard(player){
    this.cesiumService.getViewer().entities.add({
      position: this.utilsService.toFixedHeight(player.currentLocation.location, 5),
      billboard : {
        image: this.getPlayerIcon(player),
        heightReference : this.utilsService.getClampedToGroundHeightReference()
      }})
  }

  getPlayerIcon(player: PlayerFields.Fragment) {
    const url =  player.character && player.character.iconUrl;
    if (url){
      const urlSplit = url.split('.');
      let postfix = '';
      if (player.state === 'DEAD' ) {
        postfix = '-dead'
      }
      else if (this.takeControlService.selectedPlayerToControl && player.id === this.takeControlService.selectedPlayerToControl.id) {
        postfix += '-chosen'
      }
      if (player.isMe) {
        postfix += '-me'
      }

      return `${urlSplit[0]}${postfix}.${urlSplit[1]}`;
    } else {
      return '/assets/icons/grey-mark.png';
    }
  }
}
