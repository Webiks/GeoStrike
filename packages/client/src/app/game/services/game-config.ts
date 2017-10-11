export class GameConfig {
  static serverUpdatingInterval = 200;
  static maxEnterableBuildingSize = 1400;
  static minEnterableBuildingSize = 800;

  // Building settings
  static innerBuildingColor = new Cesium.Color(244.0 / 255.0, 166.0 / 255.0, 66.0 / 255.0, 1);
  static enterableBuildingColor = 'rgb(244, 166, 66)';
  static buildingHeight = 10;
  static wallSize = 0.00010;
  static windowWidth = GameConfig.wallSize / 3;
  static windowHeight = 1.5;
  static wallOnWindowSides = (GameConfig.wallSize - GameConfig.windowWidth) / 2;
  static windowHeightFromGround = 1.25;

  // Graphics
  static terrainShadows = Cesium.ShadowMode.DISABLED;
  static enableLighting = false;
  static fog = false;
}
