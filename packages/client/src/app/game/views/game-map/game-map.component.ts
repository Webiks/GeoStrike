import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcMapComponent, AcNotification, ViewerConfiguration } from 'angular-cesium';
import { GameFields } from '../../../types';

const matrix3Scratch = new Cesium.Matrix3();

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  providers: [
    ViewerConfiguration,
  ],
  styleUrls: ['./game-map.component.scss']
})
export class GameMapComponent implements OnInit {
  @Input() private playersPositions: Observable<AcNotification>;
  @Input() private gameData: Observable<GameFields.Fragment>;
  @ViewChild(AcMapComponent) private mapInstance: AcMapComponent;

  private viewer: any;

  constructor(private viewerConf: ViewerConfiguration) {
    viewerConf.viewerOptions = {
      selectionIndicator: false,
      timeline: false,
      infoBox: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      animation: false,
      homeButton: false,
      geocoder: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      terrainProviderViewModels: [],
    };

    viewerConf.viewerModifier = (viewer) => {
      this.viewer = viewer;
      Cesium.Math.setRandomNumberSeed(3);
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.bottomContainer.remove();
      const screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      screenSpaceCameraController.enableTilt = false;
      screenSpaceCameraController.enableRotate = false;
      viewer.scene.preRender.addEventListener(this.preRenderHandler.bind(this, viewer));
    };
  }

  preRenderHandler() {
    this.gameData.subscribe((currentGame) => {
      const result = this.getModelMatrix(currentGame.me);
      this.viewer.camera.lookAtTransform(result, new Cesium.Cartesian3(-20, 0, 15));
    });
  }

  ngOnInit() {
  }

  getPosition(player) {
    const { x, y, z } = player.currentLocation.location;

    return new Cesium.Cartesian3(x, y, z);
  }

  getOrientation(player) {
    const heading = Cesium.Math.toRadians(player.currentLocation.heading);
    const pitch = Cesium.Math.toRadians(0);
    const roll = Cesium.Math.toRadians(0);
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

    return Cesium.Transforms.headingPitchRollQuaternion(this.getPosition(player), hpr);
  }

  getModelMatrix(entity) {
    let result = null;
    const position = this.getPosition(entity);
    const orientation = this.getOrientation(entity);

    if (!Cesium.defined(orientation)) {
      result = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, result);
    } else {
      result = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch), position, result);
    }

    return result;
  }

  getTilesMatrix() {
    return Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, 0));
  }

  getHeightReference() {
    return Cesium.HeightReference.CLAMP_TO_GROUND;
  }
}
