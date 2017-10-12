import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CharacterService, ViewState } from '../../../services/character.service';
import { GameConfig } from '../../../services/game-config';
import { AcTileset3dComponent, CesiumService } from 'angular-cesium';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
})
export class WorldComponent implements OnInit {

  @ViewChild('tiles') tiles: AcTileset3dComponent;
  public tilesUrl = environment.tiles.url;
  public loadTiles = environment.load3dTiles;
  public tilesStyle = {
    color: {
      conditions: [
        ['${area} <= ' + GameConfig.maxEnterableBuildingSize + ' && ${area} > ' + GameConfig.minEnterableBuildingSize, GameConfig.enterableBuildingColor],
        ['true', 'rgb(255, 255, 255)'],
      ]
    }
  };
  public hideTiles = false;

  constructor(private cesiumService: CesiumService, public character: CharacterService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    if (environment.loadTerrain) {
      this.loadTerrain();
    }

    this.character.viewState$.subscribe(viewState => {
      this.hideTiles = viewState === ViewState.OVERVIEW;
      this.cd.detectChanges();
    });
  }

  loadTerrain() {
    this.cesiumService.getViewer().terrainProvider = new Cesium.CesiumTerrainProvider(environment.terrain);
  }

  getTilesMatrix() {
    return Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, 0));
  }
}
