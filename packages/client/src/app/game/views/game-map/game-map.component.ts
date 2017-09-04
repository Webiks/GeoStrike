import {
  Component , Input , OnInit , ViewChild , HostListener , ElementRef , OnDestroy , NgZone ,
  ChangeDetectorRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcMapComponent, AcNotification, ViewerConfiguration } from 'angular-cesium';
import { GameFields } from '../../../types';
import { CharacterService, MeModelState, ViewState } from '../../services/character.service';
import { UtilsService } from '../../services/utils.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  providers: [
    ViewerConfiguration,
  ],
  styleUrls: ['./game-map.component.scss']
})
export class GameMapComponent implements OnInit, OnDestroy {
  public static readonly DEFAULT_PITCH = -5;

  @Input() private playersPositions: Observable<AcNotification>;
  @Input() private gameData: Observable<GameFields.Fragment>;
  @ViewChild(AcMapComponent) private mapInstance: AcMapComponent;

  private viewer: any;

  constructor(private gameService: GameService,
              private character: CharacterService,
              private viewerConf: ViewerConfiguration,
              private utils: UtilsService,
              private elementRef: ElementRef,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef) {
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
      document.onclick = () => canvas.requestPointerLock();
    };

    this.onMousemove = this.onMousemove.bind(this);
  }

  ngOnInit() {
    this.gameData.first().subscribe(value => {
      this.character.initCharacter({
        id: 'me',
        location: this.utils.getPosition(value.me.currentLocation.location),
        heading: value.me.currentLocation.heading,
        pitch: GameMapComponent.DEFAULT_PITCH,
        state: MeModelState.WALKING,
      });

      this.viewer.scene.preRender.addEventListener(this.preRenderHandler.bind(this));

      this.ngZone.runOutsideAngular(()=>{
        this.elementRef.nativeElement.addEventListener('mousemove',this.onMousemove);
      });

      this.cd.detectChanges();
    });
  }

  onMousemove(event: MouseEvent) {
    if (!this.character.initialized) {
      return;
    }

    const pitch = this.character.pitch;
    this.character.pitch = pitch - (event.movementY / 10);

    const heading = this.character.heading;
    this.character.heading = heading + (event.movementX / 10);
    this.gameService.updatePosition(this.character.location, this.character.heading);
  }

  preRenderHandler() {
    if (!this.character.initialized) {
      return;
    }

    const pitchDeg = this.character.pitch;
    const pitch = Cesium.Math.toRadians(pitchDeg);
    const heading = Cesium.Math.toRadians(-180 + this.character.heading);

    const isFPV = this.character.viewState === ViewState.FPV;
    const isShooting = this.character.state === MeModelState.SHOOTING;
    const range = isFPV || isShooting ? 0.1 : 3;
    const playerHead = new Cesium.Cartesian3(0.4174665722530335, -1.4575908118858933, 1.3042816752567887);
    Cesium.Cartesian3.add(this.character.location, playerHead, playerHead);

    this.viewer.camera.lookAt(playerHead, new Cesium.HeadingPitchRange(heading, pitch, range));
  }

  ngOnDestroy (): void {
    this.elementRef.nativeElement.removeEventListener('mousemove',this.onMousemove)
  }
}
