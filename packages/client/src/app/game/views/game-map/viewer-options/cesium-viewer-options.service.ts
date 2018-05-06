import { Injectable } from '@angular/core';
import { GameConfig } from '../../../services/game-config';

@Injectable()
export class CesiumViewerOptionsService {
  static readonly MAX_ZOOM = 5000;
  static readonly MIN_ZOOM = 80;

  constructor() {
  }

  getViewerOption() {
    return {
      selectionIndicator: false,
      timeline: false,
      infoBox: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      animation: false,
      homeButton: false,
      geocoder: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      navigationInstructionsInitiallyVisible: false,
      terrainProviderViewModels: [],
      terrainShadows : GameConfig.terrainShadows,
    };
  }

  setInitialConfiguration(viewer) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.bottomContainer.remove();
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.scene.globe.enableLighting = GameConfig.enableLighting;
    viewer.scene.fog.enabled = GameConfig.fog;
  }

  setFpvCameraOptions(viewer) {
    const screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
    screenSpaceCameraController.enableTilt = false;
    screenSpaceCameraController.enableRotate = false;
    screenSpaceCameraController.enableZoom = false;
    const canvas = viewer.canvas;
    canvas.onclick = () => canvas.requestPointerLock();

    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1.0;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = Number.POSITIVE_INFINITY;
  }

  setFreeCameraOptions(viewer) {
    const screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
    screenSpaceCameraController.enableTilt = true;
    screenSpaceCameraController.enableRotate = true;
    screenSpaceCameraController.enableZoom = true;
    document.exitPointerLock();
    const canvas = viewer.canvas;
    canvas.onclick = () => null;

    viewer.scene.screenSpaceCameraController.minimumZoomDistance = CesiumViewerOptionsService.MIN_ZOOM;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = CesiumViewerOptionsService.MAX_ZOOM;
  }

}
