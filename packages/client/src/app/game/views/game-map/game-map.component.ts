import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  AcMapComponent,
  AcNotification,
  CesiumService,
  MapLayerProviderOptions,
  ViewerConfiguration
} from 'angular-cesium';
import {GameFields, PlayerFields} from '../../../types';
import {CharacterService, MeModelState, ViewState} from '../../services/character.service';
import {UtilsService} from '../../services/utils.service';
import {GameService} from '../../services/game.service';
import {environment} from '../../../../environments/environment';
import {CesiumViewerOptionsService} from './viewer-options/cesium-viewer-options.service';
import {CollisionDetectorService} from '../../services/collision-detector.service';
import {TakeControlService} from '../../services/take-control.service';
import {PitchCalculatorService} from './services/pitch-calculator.service';

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  providers: [
    ViewerConfiguration,
    CesiumViewerOptionsService,
    PitchCalculatorService,
    CesiumService
  ],
  styleUrls: ['./game-map.component.scss'],
})
export class GameMapComponent implements OnInit, OnDestroy {
  // public static readonly DEFAULT_START_LOCATION =
  //   Cesium.Cartesian3.fromDegrees(-73.985187, 40.758857, 1000);
  // public static readonly DEFAULT_MOUNTAINS_START_LOCATION =
  //   new Cesium.Cartesian3(-1370653.8374654655, -5507085.922189086, 2901243.9558086237);
  // public static readonly DEFAULT_AUSTRALIA_START_LOCATION =
  //   new Cesium.Cartesian3(-3787298.0827794825, 4351128.063305529, -2713957.9001589464);
  // public static readonly DEFAULT_NEWZEALAND_START_LOCATION =
  //   new Cesium.Cartesian3(-4361556.164988852, 978059.7002869517, -4534895.227650116);
  // public static readonly DEFAULT_SWISS_START_LOCATION =
  //   new Cesium.Cartesian3(4327254.413025279, 621509.1085193334, 4628696.864167333);
  public static readonly DEFAULT_PITCH = -5;
  @Input() me;
  @Input() playersPositions: Observable<AcNotification>;
  @Input() gameData: Observable<GameFields.Fragment>;
  @ViewChild(AcMapComponent) private mapInstance: AcMapComponent;

  public createPathMode = environment.createPathMode;
  private viewer: any;
  private lastPlayerLocation;
  private lastPlayerHPR: { heading: number, pitch: number, range: number };
  private lastPlayerHead;
  private helperEntityPoint;
  private lastViewState: ViewState;
  mapLayerProviderOptions: MapLayerProviderOptions;

  constructor(private gameService: GameService,
              private character: CharacterService,
              private viewerConf: ViewerConfiguration,
              private utils: UtilsService,
              private elementRef: ElementRef,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef,
              private viewerOptions: CesiumViewerOptionsService,
              private collisionDetector: CollisionDetectorService,
              private pitchCalculatorService: PitchCalculatorService,
              private takeControlService: TakeControlService,
              private cesiumService: CesiumService) {
    viewerConf.viewerOptions = viewerOptions.getViewerOption();

    viewerConf.viewerModifier = (viewer) => {
      this.viewer = viewer;
      this.helperEntityPoint = this.viewer.entities.add({
        point: {
          position: new Cesium.Cartesian3(),
          pixelSize: 1,
          color: Cesium.Color.TRANSPARENT,
          heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
        }
      });
      this.viewerOptions.setInitialConfiguration(viewer);
      if (!this.createPathMode) {
        this.viewerOptions.setFpvCameraOptions(viewer);
      }
      this.mapLayerProviderOptions = MapLayerProviderOptions.BingMaps;
    };

    this.onMousemove = this.onMousemove.bind(this);
    this.preRenderHandler = this.preRenderHandler.bind(this);
  }

  ngOnInit() {
    this.collisionDetector.init(this.mapInstance.getCesiumSerivce());
    if (this.createPathMode) {
      return;
    }

    this.gameData.first().subscribe(game => {
      this.gameService.modifyTerrainEnviorment(game.terrainType);
      this.gameService.setDefaultStartLocation(game.terrainType);
      const overviewMode = game.me['__typename'] === 'Viewer' || game.me.type === 'OVERVIEW';
      if (overviewMode) {
        this.character.viewState = ViewState.OVERVIEW;
        this.overviewSettings();
      } else {
        this.character.viewState = ViewState.SEMI_FPV;
        this.startFirstPersonMode(game.me);
      }
    });

    this.character.viewState$.subscribe((newViewState) => {
      if (this.lastViewState !== ViewState.OVERVIEW && newViewState === ViewState.OVERVIEW) {
        this.changeToOverview();
      } else if (this.lastViewState === ViewState.OVERVIEW && newViewState !== ViewState.OVERVIEW) {
        this.viewerOptions.toggleDepthTestAgainstTerrain(this.viewer, true);
        const controlledPlayer = this.takeControlService.controlledPlayer || this.character.meFromServer;
        const posWithHeight = Cesium.Cartographic.fromCartesian(controlledPlayer.currentLocation.location);
        posWithHeight.height = 5;
        let initPlayer = true;
        if (newViewState === ViewState.SEMI_FPV_NOT_CONTROLLED) {
          initPlayer = false;
          this.character.viewState = ViewState.SEMI_FPV;
          this.lastViewState = ViewState.SEMI_FPV_NOT_CONTROLLED;
        }

        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromRadians(posWithHeight.longitude, posWithHeight.latitude, posWithHeight.height),
          complete: () => {
            this.viewerOptions.setFpvCameraOptions(this.viewer);
            this.startFirstPersonMode(controlledPlayer, initPlayer);
          }
        });
      }

      this.lastViewState = newViewState;
    });

  }

  private startFirstPersonMode(player: PlayerFields.Fragment, initCharacter = true) {
    if (initCharacter) {
      this.character.initCharacter({
        id: 'me',
        location: player.enteringBuildingPosition ?
          this.utils.getPosition(player.enteringBuildingPosition) : this.utils.getPosition(player.currentLocation.location),
        heading: player.currentLocation.heading,
        pitch: GameMapComponent.DEFAULT_PITCH,
        state: player.state === 'DEAD' ? MeModelState.DEAD : MeModelState.WALKING,
        team: player.team,
        isCrawling: false,
        characterInfo: player.character
      });
    }
    this.gameService.startServerUpdatingLoop();

    this.viewer.scene.preRender.addEventListener(this.preRenderHandler);

    this.ngZone.runOutsideAngular(() => {
      this.elementRef.nativeElement.addEventListener('mousemove', this.onMousemove);
    });
    this.cd.detectChanges();
    this.character.updateCharacter();
  }

  private changeToOverview() {
    this.gameService.stopServerUpdatingLoop();
    this.elementRef.nativeElement.removeEventListener('mousemove', this.onMousemove);
    this.viewer.scene.preRender.removeEventListener(this.preRenderHandler);
    this.overviewSettings();
    this.character.updateCharacter();
  }

  private overviewSettings() {
    this.viewerOptions.setFreeCameraOptions(this.viewer);
    this.gameService.currentTerrainEnviorment.subscribe( (terrainType) => {
      if (terrainType === 'URBAN')
        this.viewer.camera.flyTo({destination: this.gameService.gameStartLocation});
      else {
        const overviewPosition = this.utils.toHeightOffset(this.gameService.gameStartLocation, 3000)
        this.viewer.camera.flyTo({destination: overviewPosition});
      }
    })
  }

  // private overviewSettings() {
  //   this.viewerOptions.setFreeCameraOptions(this.viewer);
  //   this.gameService.currentTerrainEnviorment.subscribe(terrainType => {
  //     if (terrainType == "URBAN") {
  //       this.viewer.camera.flyTo({destination: GameMapComponent.gameStartLocation});
  //     }
  //     else if (terrainType == "MOUNTAIN") {
  //       this.viewerOptions.toggleDepthTestAgainstTerrain(this.viewer, false);
  //       const alpinsOverviewPosition = this.utils.toHeightOffset(new Cesium.Cartesian3(-1370653.8374654655, -5507085.922189086, 2901243.9558086237), 3000)
  //       this.viewer.camera.flyTo({destination: alpinsOverviewPosition});
  //     }
  //     else {
  //       this.viewerOptions.toggleDepthTestAgainstTerrain(this.viewer, false);
  //       const swissOverviewPosition = this.utils.toHeightOffset(new Cesium.Cartesian3(4327254.413025279, 621509.1085193334, 4628696.864167333), 3000)
  //       this.viewer.camera.flyTo({destination: swissOverviewPosition});
  //     }
  //   })
  // }

  onMousemove(event: MouseEvent) {
    if (!this.character.initialized || !document.pointerLockElement) {
      return;
    }

    const oldPitch = this.character.pitch;
    let newPitch = oldPitch - (event.movementY / environment.controls.mouseSensitivity);

    this.pitchCalculatorService.calcAndSetNewPitch(oldPitch, newPitch);

    const oldHeading = this.character.heading;
    const newHeading = oldHeading + (event.movementX / environment.controls.mouseSensitivity);
    this.pitchCalculatorService.calcAndSetNewHeading(oldHeading, newHeading);
  }

  preRenderHandler() {
    if (!this.character.initialized || this.character.viewState === ViewState.OVERVIEW) {
      return;
    }
    const isFPV = this.character.viewState === ViewState.FPV;
    const isShooting = this.character.state === MeModelState.SHOOTING;
    const isCrawling = this.character.isCrawling;
    const range = isFPV || isShooting ? 0.1 : 4;

    const playerHeadCart = Cesium.Cartographic.fromCartesian(this.character.location);

    if (isCrawling) {
      playerHeadCart.height += 2;
    }
    else if (isFlying) {
      const height = Cesium.Cartographic.fromCartesian(this.character.location).height;
      if (this.character.flightData.remainingTime === 0 || this.character.meFromServer.flight.remainingTime === 0 || height <= 0) {
        this.flightCrashSettings();
      }
      else {
        playerHeadCart.height += 4;
      }
    }
    else
      playerHeadCart.height += 4.4;


    if (this.lastPlayerLocation === this.character.location &&
      this.lastPlayerHPR.heading === this.character.heading &&
      this.lastPlayerHPR.pitch === this.character.pitch &&
      this.lastPlayerHPR.range === range &&
      this.lastPlayerHead === playerHeadCart) {
      return;
    }

    const pitchDeg = this.character.pitch;
    const pitch = Cesium.Math.toRadians(pitchDeg);
    const heading = Cesium.Math.toRadians(-180 + this.character.heading);
    this.helperEntityPoint.position =
      Cesium.Cartesian3.fromRadians(playerHeadCart.longitude, playerHeadCart.latitude, playerHeadCart.height);
    this.viewer.zoomTo([this.character.entity, this.helperEntityPoint], new Cesium.HeadingPitchRange(heading, pitch, range));
    this.lastPlayerLocation = this.character.location;
    this.lastPlayerHead = playerHeadCart;
    this.lastPlayerHPR = {heading: this.character.heading, pitch: this.character.pitch, range};
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.removeEventListener('mousemove', this.onMousemove);
  }
}
