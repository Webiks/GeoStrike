import { Component, OnInit } from '@angular/core';
import { CesiumService } from 'angular-cesium';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
})
export class WorldComponent implements OnInit {
  private newYorkTilesUrl = 'https://beta.cesium.com/api/assets/1461?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYWJmM2MzNS02OWM5LTQ3OWItYjEyYS0xZmNlODM5ZDNkMTYiLCJpZCI6NDQsImFzc2V0cyI6WzE0NjFdLCJpYXQiOjE0OTkyNjQ3NDN9.vuR75SqPDKcggvUrG_vpx0Av02jdiAxnnB1fNf-9f7s';

  constructor(private cesiumService: CesiumService) {
  }

  ngOnInit() {
  }

  loadTerrain() {
    this.cesiumService.getViewer().terrainProvider = new Cesium.CesiumTerrainProvider({
      url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
      // url : 'https://assets.agi.com/stk-terrain/v1/tilesets/PAMAP/tiles',
      requestWaterMask: true,
      requestVertexNormals: true
    });
  }

  getTilesMatrix() {
    return Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, 0));
  }
}
