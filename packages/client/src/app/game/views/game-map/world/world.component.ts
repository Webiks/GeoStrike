import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CharacterService, ViewState, } from '../../../services/character.service';
import { GameConfig } from '../../../services/game-config';
import { AcEntity, AcNotification, AcTileset3dComponent, ActionType, CesiumService, } from 'angular-cesium';
import { environment } from '../../../../../environments/environment';
import { UtilsService } from '../../../services/utils.service';
import { backgroundItemsData } from './background-data';
import { Subject } from 'rxjs/Subject';
import { GameService } from "../../../services/game.service";

export class BackgroundEntity extends AcEntity {
}

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
})
export class WorldComponent implements OnInit {
  @ViewChild('tiles') tiles: AcTileset3dComponent;
  public tilesUrl = environment.tiles;
  public loadTiles = environment.load3dTiles;
  public treesAndBoxes$: Subject<AcNotification> = new Subject();
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
  private treesAndBoxes;
  private terrainView: string = 'URBAN';

  constructor(public utils: UtilsService,
              private cesiumService: CesiumService,
              public character: CharacterService,
              private cd: ChangeDetectorRef,
              private gameService: GameService) {
    this.drawBackgroundItems();
  }

  private drawBackgroundItems() {
    this.treesAndBoxes = backgroundItemsData.reduce(
      (array, treeModel) => [
        ...array,
        ...treeModel.positions.map(position => new BackgroundEntity({
          model: treeModel.model,
          scale: treeModel.scale,
          orientation: this.utils.getOrientation(position.location, Math.random() * 360),
          position: position.location,
        })),
      ],
      [],
    );
    this.treesAndBoxes.map((tree, i) => ({
      id: i.toString(),
      actionType: ActionType.ADD_UPDATE,
      entity: new AcEntity(tree),
    })).forEach((treeNotification) => this.treesAndBoxes$.next(treeNotification));
  }

  ngOnInit() {
    this.setTerrainType();
    this.character.viewState$.subscribe(viewState => {
      this.hideWorld = viewState === ViewState.OVERVIEW;
      if (this.tiles && this.tiles.tilesetInstance) {
        this.tiles.tilesetInstance.show = !this.hideWorld;
      }
      this.cd.detectChanges();
      this.drawBackgroundItems();
    });
  }

  loadTerrain() {
    // this.cesiumService.getViewer().terrainProvider = Cesium.createWorldTerrain();
    this.cesiumService.getViewer().terrainProvider = new Cesium.CesiumTerrainProvider(
      environment.terrain
    );
  }

  getTilesMatrix() {
    return Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, 0));
  }

  setTerrainType() {
    this.gameService.currentTerrainEnviorment.subscribe(terrainType => {
      this.terrainView = terrainType;
      let tilesStr = terrainType.toLowerCase()+"_url";
      this.tilesUrl = environment.tiles[tilesStr];
      if (terrainType !== 'URBAN')
        this.loadTerrain();
    })
  }
}
