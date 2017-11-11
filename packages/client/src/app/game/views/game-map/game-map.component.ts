import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcMapComponent, AcNotification, ViewerConfiguration } from 'angular-cesium';
import { GameFields, PlayerFields } from '../../../types';
import { CharacterService, MeModelState, ViewState } from '../../services/character.service';
import { UtilsService } from '../../services/utils.service';
import { GameService } from '../../services/game.service';
import { environment } from '../../../../environments/environment';
import { CesiumViewerOptionsService } from './viewer-options/cesium-viewer-options.service';
import { CollisionDetectorService } from '../../services/collision-detector.service';
import { TakeControlService } from '../../services/take-control.service';

@Component({
  selector: 'game-map',
  templateUrl: './game-map.component.html',
  providers: [
    ViewerConfiguration,
    CesiumViewerOptionsService
  ],
  styleUrls: ['./game-map.component.scss'],
})
export class GameMapComponent implements OnInit, OnDestroy {
  public static readonly DEFAULT_START_LOCATION =
    Cesium.Cartesian3.fromDegrees(-73.985187, 40.758857, 1000);
  public static readonly DEFAULT_PITCH = -5;

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

  constructor(private gameService: GameService,
              private character: CharacterService,
              private viewerConf: ViewerConfiguration,
              private utils: UtilsService,
              private elementRef: ElementRef,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef,
              private viewerOptions: CesiumViewerOptionsService,
              private collisionDetector: CollisionDetectorService,
              private takeControlService: TakeControlService) {
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

        const posWithHeight = Cesium.Cartographic.fromCartesian(this.character.location);
        posWithHeight.height = 5;

        this.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromRadians(posWithHeight.longitude, posWithHeight.latitude, posWithHeight.height),
          complete: () => {
            this.viewerOptions.setFpvCameraOptions(this.viewer);
            const controlledPlayer = this.takeControlService.controlledPlayer || this.character.meFromServer;
            this.startFirstPersonMode(controlledPlayer);
          }
        });

      }

      this.lastViewState = newViewState;
    });

  }

  private startFirstPersonMode(player: PlayerFields.Fragment) {
    this.character.initCharacter({
      id: 'me',
      location: this.utils.getPosition(player.currentLocation.location),
      heading: player.currentLocation.heading,
      pitch: GameMapComponent.DEFAULT_PITCH,
      state: player.state === 'DEAD' ? MeModelState.DEAD : MeModelState.WALKING,
      team: player.team,
      isCrawling: false,
      characterInfo: player.character
    });
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
  }

  private overviewSettings() {
    this.viewerOptions.setFreeCameraOptions(this.viewer);
    this.viewer.camera.flyTo({ destination: GameMapComponent.DEFAULT_START_LOCATION });
  }

  onMousemove(event: MouseEvent) {
    if (!this.character.initialized) {
      return;
    }

    const pitch = this.character.pitch;
    this.character.pitch = pitch - (event.movementY / environment.controls.mouseSensitivity);

    const heading = this.character.heading;
    this.character.heading = heading + (event.movementX / environment.controls.mouseSensitivity);
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
    playerHeadCart.height += isCrawling ? 2 : 4.4;

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
    this.helperEntityPoint.position = Cesium.Cartesian3.fromRadians(playerHeadCart.longitude, playerHeadCart.latitude, playerHeadCart.height);
    this.viewer.zoomTo([this.character.entity, this.helperEntityPoint], new Cesium.HeadingPitchRange(heading, pitch, range));
    this.lastPlayerLocation = this.character.location;
    this.lastPlayerHead = playerHeadCart;
    this.lastPlayerHPR = { heading: this.character.heading, pitch: this.character.pitch, range };
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.removeEventListener('mousemove', this.onMousemove);
  }
}
