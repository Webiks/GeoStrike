import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  CharacterService,
  ViewState,
} from '../../../services/character.service';
import { GameConfig } from '../../../services/game-config';
import {
  AcEntity,
  AcNotification,
  AcTileset3dComponent,
  ActionType,
  CesiumService,
} from 'angular-cesium';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { treeData } from './tree-data';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
})
export class WorldComponent implements OnInit {
  @ViewChild('tiles') tiles: AcTileset3dComponent;
  public tilesUrl = environment.tiles.url;
  public loadTiles = environment.load3dTiles;
  public trees$: Observable<AcNotification>;
  public tilesStyle = {
    color: {
      conditions: [
        [
          '${area} <= ' +
            GameConfig.maxEnterableBuildingSize +
            ' && ${area} > ' +
            GameConfig.minEnterableBuildingSize,
          GameConfig.enterableBuildingColor,
        ],
        ['true', 'rgb(255, 255, 255)'],
      ],
    },
  };
  public hideWorld = false;

  constructor(
    public utils: UtilsService,
    private cesiumService: CesiumService,
    public character: CharacterService,
    private cd: ChangeDetectorRef
  ) {
    const trees = treeData.reduce(
      (array, treeModel) => [
        ...array,
        ...treeModel.positions.map(position => ({
          model: treeModel.model,
          position: position.location,
        })),
      ],
      [],
    );
    this.trees$ = Observable.from(trees).map((tree, i) => ({
      id: i.toString(),
      actionType: ActionType.ADD_UPDATE,
      entity: new AcEntity(tree),
    }));
  }

  ngOnInit() {
    if (environment.loadTerrain) {
      this.loadTerrain();
    }

    this.character.viewState$.subscribe(viewState => {
      this.hideWorld = viewState === ViewState.OVERVIEW;
      this.cd.detectChanges();
    });
  }

  loadTerrain() {
    this.cesiumService.getViewer().terrainProvider = new Cesium.CesiumTerrainProvider(
      environment.terrain
    );
  }

  getTilesMatrix() {
    return Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, 0));
  }
}
