import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs/Observable";
import {
  AcMapComponent, AcNotification, CesiumService, MapLayerProviderOptions,
  ViewerConfiguration
} from "angular-cesium";
import { GameFields, PlayerFields } from "../../../types";
import { CharacterService, MeModelState, ViewState } from "../../services/character.service";
import { UtilsService } from "../../services/utils.service";
import { GameService } from "../../services/game.service";
import { environment } from "../../../../environments/environment";
import { CesiumViewerOptionsService } from "./viewer-options/cesium-viewer-options.service";
import { CollisionDetectorService } from "../../services/collision-detector.service";
import { TakeControlService } from "../../services/take-control.service";
import { PitchCalculatorService } from "./services/pitch-calculator.service";
import { FlightModeService } from "../game-container/flight-mode/flight-mode.service";
import {Subject} from "rxjs/Subject";

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
  public static readonly DEFAULT_START_LOCATION = Cesium.Cartesian3.fromDegrees(
    -73.985187,
    40.758857,
    1000
  );
  public static readonly DEFAULT_PITCH = -5;
  @Input() me;
  // @Input() playersPositions: Observable<AcNotification>;
  @Input() playersPositions: Observable<any>;
  @Input() flights: Observable<AcNotification>;
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

  constructor(
    private gameService: GameService,
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
    private flightService: FlightModeService,
    private cesiumService: CesiumService
  ) {
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
      const overviewMode =
        game.me["__typename"] === "Viewer" || game.me.type === "OVERVIEW";
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
      } else if (
        this.lastViewState === ViewState.OVERVIEW &&
        newViewState !== ViewState.OVERVIEW
      ) {
        const controlledPlayer =
          this.takeControlService.controlledPlayer ||
          this.character.meFromServer;
        const posWithHeight = Cesium.Cartographic.fromCartesian(
          controlledPlayer.currentLocation.location
        );
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
        // this.viewer.entities.removeAll();
      }

      this.lastViewState = newViewState;
    });

    this.playersPositions
      .map(player => player.entity)
      .filter(x => x.team !== "NONE")
      .subscribe(x => {
        this.viewer.entities.add({
          name: "test",
          position: x.currentLocation.location,
          billboard: {
            image: new Cesium.PinBuilder()
              .fromText("?", Cesium.Color.BLACK, 48)
              .toDataURL(),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            color: 0.0
          }
        });
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
        isShooting:false,
        isFlying: false,
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
    this.gameService.currentTerrainEnviorment.subscribe(() => {
    this.viewer.flyTo(this.viewer.entities);

    });
  }

  private flightCrashSettings() {
    let speed = environment.movement.flyingLowSpeed;
    let crashDestination = this.utils.pointByLocationDistanceAndAzimuthAndHeight3d(
      this.character.location,
      speed,
      Cesium.Math.toRadians(this.character.heading + 180),
      true
    );
    crashDestination = this.utils.toFixedHeight(crashDestination);
    crashDestination = this.utils.toHeightOffset(crashDestination, 1);
    this.character.location = crashDestination;
    this.viewer.camera.flyTo({destination: crashDestination, duration: 2});
    this.character.isCrawling = true;
  }

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
    const isFlying = this.character.isFlying;
    const range = isFlying ? 7 : isFPV ? 0.1 : 4;

    const playerHeadCart = Cesium.Cartographic.fromCartesian(this.character.location);

    if (isCrawling) {
      playerHeadCart.height += 2;
    } else if (isFlying) {
      const height = Cesium.Cartographic.fromCartesian(this.character.location)
        .height;
      if (
        this.character.flightData.remainingTime === 0 ||
        this.character.meFromServer.flight.remainingTime === 0 ||
        height <= 0
      || this.character.state === MeModelState.DEAD) {
        this.flightCrashSettings();
      }
      else {
        playerHeadCart.height += 4;
      }
    }
    else
      playerHeadCart.height += 4.4;

    if (
      this.lastPlayerLocation === this.character.location &&
      this.lastPlayerHPR.heading === this.character.heading &&
      this.lastPlayerHPR.pitch === this.character.pitch &&
      this.lastPlayerHPR.range === range &&
      this.lastPlayerHead === playerHeadCart) {
      return;
    }


    if(this.lastPlayerLocation && Cesium.Cartographic.fromCartesian(this.character.location).longitude === Cesium.Cartographic.fromCartesian(this.lastPlayerLocation).longitude && !this.character.isFlying){
      this.flightService.isPlayerMoving.next(false);
    }
    else{
      this.flightService.isPlayerMoving.next(true);
    }

    if(this.character.isFlying && (Cesium.Cartographic.fromCartesian(this.character.location).longitude === Cesium.Cartographic.fromCartesian(this.lastPlayerLocation).longitude) &&
      (Cesium.Cartographic.fromCartesian(this.character.location).latitude === Cesium.Cartographic.fromCartesian(this.lastPlayerLocation).latitude) ) {
        this.flightService.isInFlightModeNotMoving.next(true);
    }
    else {
      this.flightService.isInFlightModeNotMoving.next(false);
    }

    const pitchDeg = this.character.pitch;
    const pitch = Cesium.Math.toRadians(pitchDeg);
    const heading = Cesium.Math.toRadians(-180 + this.character.heading);
    this.helperEntityPoint.position = Cesium.Cartesian3.fromRadians(
      playerHeadCart.longitude,
      playerHeadCart.latitude,
      playerHeadCart.height
    );
      this.viewer.zoomTo(
        [this.character.entity, this.helperEntityPoint],
        new Cesium.HeadingPitchRange(heading, pitch, range));
    this.lastPlayerLocation = this.character.location;
    this.lastPlayerHead = playerHeadCart;
    this.lastPlayerHPR = {heading: this.character.heading, pitch: this.character.pitch, range};
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.removeEventListener('mousemove', this.onMousemove);
  }
}
