export class GameSettingsService {
  static serverUpdatingInterval = 200;
  static maxEnterableBuildingSize = 1400;
  static minEnterableBuildingSize = 800;

  // Building settings
  static innerBuildingColor = new Cesium.Color(244.0 / 255.0, 166.0 / 255.0, 66.0 / 255.0, 1);
  static enterableBuildingColor = 'rgb(244, 166, 66)';
  static buildingHeight = 10;
  static wallSize = 0.00010;
  static windowWidth = GameSettingsService.wallSize / 3;
  static windowHeight = 1.5;
  static wallOnWindowSides = (GameSettingsService.wallSize - GameSettingsService.windowWidth) / 2;
  static windowHeightFromGround = 1.25;
}
