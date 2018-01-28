export class GameConfig {
  static serverUpdatingInterval = 200;
  static maxEnterableBuildingSize = 3000;
  static minEnterableBuildingSize = 1000;

  // Building settings
  static innerBuildingColor = new Cesium.Color.fromBytes(40, 40, 40);
  static enterableBuildingColor = 'rgb(125, 125, 125)';
  static roomHeight = 5;
  static roomFloorHeightFromGround = 7;
  static wallSize = 0.00010;
  static windowWidth = GameConfig.wallSize / 3;
  static windowHeight = 1.5;
  static wallOnWindowSides = (GameConfig.wallSize - GameConfig.windowWidth) / 2;
  static windowHeightFromFloor = 1.25;

  // Graphics
  static terrainShadows = Cesium.ShadowMode.DISABLED;
  static enableLighting = false;
  static fog = false;
}
