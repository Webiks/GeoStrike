import { Injectable } from '@angular/core';

@Injectable()
export class GameSettingsService {
  static serverUpdatingInterval = 200;
  static maxEnterableBuildingSize = 800;
  static minEnterableBuildingSize = 600;

  // Building settings
  static innerBuildingColor = new Cesium.Color(244.0 / 255.0, 166.0 / 255.0, 66.0 / 255.0, 1);
  static enterableBuildingColor = 'rgb(244, 166, 66)';
  static buildingHeight = 10;
  static wallSize = 0.00005;
  static windowWidth = GameSettingsService.wallSize / 2;
  static wallOnWindowSides = (GameSettingsService.wallSize - GameSettingsService.windowWidth) / 2;
  static windowHeightFromGround = 1.25;
  static windowHeight = 1;
}
