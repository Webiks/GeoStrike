import { Injectable } from '@angular/core';

@Injectable()
export class CesiumViewerOptionsService {

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
      // terrainShadows : Cesium.ShadowMode.ENABLED,
    };
  }

  setInitialConfiguration(viewer) {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.bottomContainer.remove();
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    // viewer.scene.globe.enableLighting = true;
    // viewer.scene.fog.enabled = true;
  }

  setFpvCameraOptions(viewer) {
    const screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
    screenSpaceCameraController.enableTilt = false;
    screenSpaceCameraController.enableRotate = false;
    screenSpaceCameraController.enableZoom = false;
    const canvas = viewer.canvas;
    canvas.onclick = () => canvas.requestPointerLock();
  }

  setFreeCameraOptions(viewer) {
    const screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
    screenSpaceCameraController.enableTilt = true;
    screenSpaceCameraController.enableRotate = true;
    screenSpaceCameraController.enableZoom = true;
    document.exitPointerLock();
    const canvas = viewer.canvas;
    canvas.onclick = () => null;
  }

}
