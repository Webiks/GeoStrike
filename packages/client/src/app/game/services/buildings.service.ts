import { Injectable } from '@angular/core';
import { AcNotification, ActionType } from 'angular-cesium';
import { GameConfig } from './game-config';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BuildingsService {

  private buildings$ = new Subject<AcNotification>();
  private building;
  private id = '__building-interior';

  constructor() {
  }

  init() {
    this.building = this.createBuilding(new Cesium.Cartesian3(1000, 1000, 1000));
  }

  getBuildings(): Subject<AcNotification> {
    return this.buildings$;
  }

  createBuilding(position: Cartesian3): any {
    const center: any = Cesium.Cartographic.fromCartesian(position);
    center.latitude = Cesium.Math.toDegrees(center.latitude);
    center.longitude = Cesium.Math.toDegrees(center.longitude);
    const ceilingHeight = GameConfig.roomFloorHeightFromGround + GameConfig.roomHeight;
    const wallSize = GameConfig.wallSize;
    const wallOnWindowSides = GameConfig.wallOnWindowSides;
    const windowHeightFromGround = GameConfig.roomFloorHeightFromGround + GameConfig.windowHeightFromFloor;
    const windowHeight = GameConfig.windowHeight;
    const floorHeight = GameConfig.roomFloorHeightFromGround;
    const roomOffset = wallSize / 2;
    this.building = {
      id: this.id,
      wallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude - roomOffset, center.latitude - roomOffset, ceilingHeight,
        center.longitude - roomOffset, center.latitude + roomOffset, ceilingHeight,
        center.longitude + roomOffset, center.latitude + roomOffset, ceilingHeight,
        center.longitude + roomOffset, center.latitude - roomOffset, ceilingHeight,
        center.longitude - roomOffset, center.latitude - roomOffset, ceilingHeight
      ]),
      lowerWallsMaxHeights: [
        windowHeightFromGround,
        windowHeightFromGround,
        windowHeightFromGround,
        windowHeightFromGround,
        windowHeightFromGround
      ],
      upperWallsMinHeights: [
        windowHeightFromGround + windowHeight,
        windowHeightFromGround + windowHeight,
        windowHeightFromGround + windowHeight,
        windowHeightFromGround + windowHeight,
        windowHeightFromGround + windowHeight,
      ],
      southEastWallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude + roomOffset, center.latitude - roomOffset + wallOnWindowSides, ceilingHeight,
        center.longitude + roomOffset, center.latitude - roomOffset, ceilingHeight,
        center.longitude + roomOffset - wallOnWindowSides, center.latitude - roomOffset, ceilingHeight,
      ]),
      southWestWallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude - roomOffset + wallOnWindowSides, center.latitude - roomOffset, ceilingHeight,
        center.longitude - roomOffset, center.latitude - roomOffset, ceilingHeight,
        center.longitude - roomOffset, center.latitude - roomOffset + wallOnWindowSides, ceilingHeight,
      ]),
      northEastWallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude + roomOffset - wallOnWindowSides, center.latitude + roomOffset, ceilingHeight,
        center.longitude + roomOffset, center.latitude + roomOffset, ceilingHeight,
        center.longitude + roomOffset, center.latitude + roomOffset - wallOnWindowSides, ceilingHeight,
      ]),
      northWestWallsPositions: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude - roomOffset, center.latitude + roomOffset - wallOnWindowSides, ceilingHeight,
        center.longitude - roomOffset, center.latitude + roomOffset, ceilingHeight,
        center.longitude - roomOffset + wallOnWindowSides, center.latitude + roomOffset, ceilingHeight,
      ]),
      ceiling: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude - roomOffset, center.latitude - roomOffset, ceilingHeight,
        center.longitude - roomOffset, center.latitude + roomOffset, ceilingHeight,
        center.longitude + roomOffset, center.latitude + roomOffset, ceilingHeight,
        center.longitude + roomOffset, center.latitude - roomOffset, ceilingHeight,
      ]),
      floor: Cesium.Cartesian3.fromDegreesArrayHeights([
        center.longitude - roomOffset, center.latitude - roomOffset, floorHeight,
        center.longitude - roomOffset, center.latitude + roomOffset, floorHeight,
        center.longitude + roomOffset, center.latitude + roomOffset, floorHeight,
        center.longitude + roomOffset, center.latitude - roomOffset, floorHeight,
      ]),
    };
    this.buildings$.next({ id: this.id, entity: this.building, actionType: ActionType.ADD_UPDATE });
    return this.building;
  }
}
