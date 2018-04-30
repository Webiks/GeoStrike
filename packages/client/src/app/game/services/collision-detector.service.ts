import { Injectable } from '@angular/core';
import { CesiumService } from 'angular-cesium';
import { CharacterService } from './character.service';
import { GameConfig } from './game-config';

@Injectable()
export class CollisionDetectorService {
  static readonly COLLIDE_FACTOR_METER = 3;
  static readonly COLLIDE_FLIGHT_FACTOR_METER = 2;
  private viewer;
  private _collision = false;
  private characterHeadingWhenCollided: number;
  private collisionChecks = 0;
  private roomCollisionRange = 0.0000002;
  private windowCenter = new Cesium.Cartesian2(
    document.body.clientWidth / 2,
    document.body.clientHeight / 2
  );

  constructor(private character: CharacterService) {}

  init(cesiumService: CesiumService) {
    this.viewer = cesiumService.getViewer();
  }

  private getDepthDistance(
    fromLocation: Cartesian3,
    toWindowPosition: Cartesian2,
    checkNow = false
  ): number {
    this.collisionChecks = this.collisionChecks % 5;
    if (!checkNow && this.collisionChecks !== 0) {
      this.collisionChecks++;
      return Number.MAX_SAFE_INTEGER;
    }
    const toLocation = this.viewer.scene.pickPosition(toWindowPosition);
    if (!toLocation) {
      return Number.MAX_SAFE_INTEGER;
    }
    const distance = Cesium.Cartesian3.distance(fromLocation, toLocation);
    return distance ? distance : Number.MAX_SAFE_INTEGER;
  }

  private checkCollisionInRoom(location): boolean {
    const positions = this.character.enteredBuilding.ceiling.map(position =>
      Cesium.Cartographic.fromCartesian(position)
    );
    const characterPosition = Cesium.Cartographic.fromCartesian(location);
    const maxLongitude = positions.reduce(
      (value, pos) => Math.max(value, pos.longitude),
      Number.MIN_SAFE_INTEGER
    );
    const maxLatitude = positions.reduce(
      (value, pos) => Math.max(value, pos.latitude),
      Number.MIN_SAFE_INTEGER
    );
    const minLongitude = positions.reduce(
      (value, pos) => Math.min(value, pos.longitude),
      Number.MAX_SAFE_INTEGER
    );
    const minLatitude = positions.reduce(
      (value, pos) => Math.min(value, pos.latitude),
      Number.MAX_SAFE_INTEGER
    );

    const collision =
      characterPosition.longitude + this.roomCollisionRange > maxLongitude ||
      characterPosition.latitude + this.roomCollisionRange > maxLatitude ||
      characterPosition.longitude - this.roomCollisionRange < minLongitude ||
      characterPosition.latitude - this.roomCollisionRange < minLatitude;

    this.character.canExitBuilding = this.collision;
    return collision;
  }

  public detectCollision(
    fromLocation,
    skipHeadingOptimization = false
  ): boolean {
    if (
      !this.character.enteredBuilding &&
      !skipHeadingOptimization &&
      this._collision &&
      this.characterHeadingWhenCollided &&
      this.characterHeadingWhenCollided === this.character.heading
    ) {
      return true;
    } else if (this._collision) {
      this._collision = this.character.enteredBuilding
        ? this.checkCollisionInRoom(fromLocation)
        : this.getDepthDistance(fromLocation, this.windowCenter, true) <
          (!this.character.isFlying
            ? CollisionDetectorService.COLLIDE_FACTOR_METER
            : CollisionDetectorService.COLLIDE_FLIGHT_FACTOR_METER);
    } else {
      this._collision = this.character.enteredBuilding
        ? this.checkCollisionInRoom(fromLocation)
        : this.getDepthDistance(fromLocation, this.windowCenter) <
        (!this.character.isFlying
          ? CollisionDetectorService.COLLIDE_FACTOR_METER
          : CollisionDetectorService.COLLIDE_FLIGHT_FACTOR_METER);
    }

    if (this._collision) {
      this.characterHeadingWhenCollided = this.character.heading;
      if (!this.character.enteredBuilding) {
        const pickedFeature = this.viewer.scene.pick(
          this.windowCenter,
          300,
          300
        );
        if (pickedFeature && pickedFeature._batchId) {
          const id = pickedFeature._batchId;
          const batchTableJson =
            pickedFeature._content._batchTable.batchTableJson;
          const latitude = batchTableJson.latitude[id];
          const longitude = batchTableJson.longitude[id];
          const area = batchTableJson.area[id];
          if (
            area <= GameConfig.maxEnterableBuildingSize &&
            area >= GameConfig.minEnterableBuildingSize
          ) {
            this.character.nearbyBuildingPosition = Cesium.Cartesian3.fromRadians(
              longitude,
              latitude,
              0
            );
            this.character.tileBuilding = pickedFeature;
          }
        } else {
          this.character.nearbyBuildingPosition = undefined;
        }
      }
    } else {
      this.character.nearbyBuildingPosition = undefined;
    }
    return this._collision;
  }

  get collision(): boolean {
    return this._collision;
  }

  resetCollisionState() {
    this._collision = false;
    this.collisionChecks = 0;
  }
}
