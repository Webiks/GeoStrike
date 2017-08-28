import { Component, Input, OnInit, ViewChild, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcMapComponent, AcNotification, ViewerConfiguration, ActionType, GeoUtilsService } from 'angular-cesium';
import { GameFields } from '../../../types';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const matrix3Scratch = new Cesium.Matrix3();

export enum MeModelState {
  WALKING,
  RUNNING,
  LYING,
  SHOOTING,
}

export interface MeState {
  id: string;
  location: any; // Cesium.Cartesian3
  heading: number;
  state: MeModelState;
}

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

  private me$: BehaviorSubject<MeState> = new BehaviorSubject<MeState>(null);

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
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.bottomContainer.remove();
      const screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      screenSpaceCameraController.enableTilt = false;
      screenSpaceCameraController.enableRotate = false;
      screenSpaceCameraController.enableZoom = false;
      const canvas = viewer.canvas;
      canvas.onclick = () => canvas.requestPointerLock();
    };
  }

  get meNotifications$() {
    return this.me$.filter(f => f !== null).map(meState => ({
      actionType: ActionType.ADD_UPDATE,
      id: meState.id,
      entity: meState,
    }));
  }

  ngOnInit() {
    this.gameData.first().subscribe(value => {
      this.me$.next({
        id: 'me',
        location: this.getPosition(value.me.currentLocation.location),
        heading: value.me.currentLocation.heading,
        state: MeModelState.WALKING,
      });

      this.viewer.scene.preRender.addEventListener(this.preRenderHandler.bind(this));
    });
  }

  // XXX: Should this be a layer as well?
  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    const currentState = this.me$.getValue();
    if (!currentState) return;
    const rotateStep = event.movementX / 10;
    this.me$.next({
      ...currentState,
      heading: currentState.heading + rotateStep,
    });
  }

  preRenderHandler() {
    const currentState = this.me$.getValue();
    if (!currentState) return;

    const heading = Cesium.Math.toRadians(-180 + currentState.heading);
    const pitch = Cesium.Math.toRadians(-10);
    const range = 10;
    const playerHead = Cesium.Cartesian3.add(currentState.location, new Cesium.Cartesian3(0,0,0), new Cesium.Cartesian3());

    this.viewer.camera.lookAt(playerHead, new Cesium.HeadingPitchRange(heading, pitch, range));
  }

  getPosition(location) {
    const { x, y, z } = location;

    return new Cesium.Cartesian3(x, y, z);
  }

  getOrientation(location, heading) {
    const headingC = Cesium.Math.toRadians(heading);
    const pitch = Cesium.Math.toRadians(0);
    const roll = Cesium.Math.toRadians(0);
    const hpr = new Cesium.HeadingPitchRoll(headingC, pitch, roll);

    return Cesium.Transforms.headingPitchRollQuaternion(this.getPosition(location), hpr);
  }

  getModelMatrix(location, heading) {
    const orientation = this.getOrientation(location, heading);

    if (!Cesium.defined(orientation)) {
      return Cesium.Transforms.eastNorthUpToFixedFrame(location, undefined, null);
    } else {
      return Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch), location, null);
    }
  }

  getCharacterModelMatrix(location, heading) {
    const orientation = this.getOrientation(location, 180);

    return Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch), location, null);
  }

  getTilesMatrix() {
    return Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, 0));
  }

  getHeightReference() {
    return Cesium.HeightReference.CLAMP_TO_GROUND;
  }
}
