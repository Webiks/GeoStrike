import { Component, OnInit } from '@angular/core';
import { GameConfig } from '../../../services/game-config';
import { CesiumService } from 'angular-cesium';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
})
export class WorldComponent implements OnInit {
  public newYorkTilesUrl = 'https://beta.cesium.com/api/assets/1461?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2MzNS02OWM5LTQ3OWItYjEyYS0xZmNlODM5ZDNkMTYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjFdLCJpYXQiOjE0OTkyNjQ3NDN9.vuR75SqPDKcggvUrG_vpx0Av02jdiAxnnB1fNf-9f7s';
  public tilesStyle = {
    color: {
      conditions: [
        ['${area} <= ' + GameConfig.maxEnterableBuildingSize + ' && ${area} > ' + GameConfig.minEnterableBuildingSize, GameConfig.enterableBuildingColor],
        ['true', 'rgb(255, 255, 255)'],
      ]
    }
  };

  constructor(private cesiumService: CesiumService) {
  }

  ngOnInit() {
    if (environment.loadTerrain) {
      this.loadTerrain();
    }
  }

  loadTerrain() {
    this.cesiumService.getViewer().terrainProvider = new Cesium.CesiumTerrainProvider(environment.terrain);
  }

  getTilesMatrix() {
    return Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, 0));
  }
}
