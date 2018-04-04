import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AcNotification,
  ActionType,
  CameraService,
  CesiumEvent,
  CoordinateConverter,
  MapEventsManagerService,
  PickOptions
} from 'angular-cesium';
import { Subject } from 'rxjs/Subject';
import { GameMapComponent } from '../game-map.component';
import { GameService } from "../../../services/game.service";

interface PathNode {
  location: Cartesian3;
  id: string;
  points?: [string] ;
}

@Component({
  selector: 'path-creator',
  templateUrl: './path-creator.component.html',
  styleUrls: ['./path-creator.component.scss'],
  providers: [CoordinateConverter]
})
export class PathCreatorComponent implements OnInit {
  showJsonPanel = false;
  points$: Subject<AcNotification>;
  pointsPathMap: Map<string, PathNode> = new Map();
  redColor = Cesium.Color.RED;
  polyLinePoints = [];

  private idCounter = 1;
  private lastPathNode: PathNode;

  constructor(private mapEventManager: MapEventsManagerService,
              private geoConverter: CoordinateConverter,
              private cameraService: CameraService,
              private gameService: GameService) {
    this.points$ = new Subject<AcNotification>();
  }

  get pointPaths(){
    return Array.from(this.pointsPathMap.values());
  }

  ngOnInit() {
    this.gameService.currentTerrainEnviorment.subscribe(() => {
      this.cameraService.cameraFlyTo(({destination: GameMapComponent.gameStartLocation}));
    })

    this.mapEventManager
      .register({event: CesiumEvent.LEFT_CLICK, pick: PickOptions.PICK_FIRST})
      .subscribe((result) => {
        const clickPosition = this.geoConverter.screenToCartesian3(result.movement.endPosition);
        const existingPoint: PathNode = result.entities && result.entities.length && result.entities[0];

        if (!existingPoint) {
          this.createNewPathNode(clickPosition)
        } else {
          // update existing point
          this.updatePathNode(existingPoint);
        }

        this.polyLinePoints.push(clickPosition);
      })
  }

  updatePathNode(existingPoint: PathNode){
    const lastPointId = this.lastPathNode.id;
    if (existingPoint.id !== lastPointId && !existingPoint.points.find(pointId => pointId === lastPointId)) {
      existingPoint.points.push(lastPointId);
    }
    if (existingPoint.id !== lastPointId && !this.lastPathNode.points.find(pointId => pointId === existingPoint.id)) {
      this.lastPathNode.points.push(existingPoint.id)
    }

    this.lastPathNode = existingPoint;
  }

  createNewPathNode(clickPosition: Cartesian3) {
    const newPathNode: PathNode = {
      id: this.idCounter.toString(),
      location: clickPosition,
      points: this.lastPathNode ? [this.lastPathNode.id] : [] as [string],
    };
    if (this.lastPathNode) {
      this.lastPathNode.points.push(newPathNode.id);
    }

    this.points$.next({
      id: newPathNode.id,
      entity: newPathNode,
      actionType: ActionType.ADD_UPDATE,
    });

    this.pointsPathMap.set(newPathNode.id, newPathNode);
    this.idCounter++;
    this.lastPathNode = newPathNode;
  }

  getLinePositions() {
    return this.polyLinePoints
      .map(location => Cesium.Cartographic.fromCartesian(location))
      .map(locationCart => {
        locationCart.height = +10;
        return locationCart;
      })
      .map(locationCart => Cesium.Cartesian3.fromRadians(locationCart.longitude, locationCart.latitude, locationCart.height));
  }

  showJSONPath() {
    JSON.stringify(Array.from(this.pointsPathMap.values()));
    this.showJsonPanel = true;

  }

  reset(){
    this.showJsonPanel = false;
    this.idCounter = 0;
    this.polyLinePoints =[];
    this.lastPathNode = null;
    this.pointsPathMap.forEach(value => {
      this.points$.next({
        id: value.id,
        actionType: ActionType.DELETE,
      });
    });
    this.pointsPathMap.clear();

  }


}
