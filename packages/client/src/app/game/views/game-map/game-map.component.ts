import { ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcMapComponent, AcNotification, ViewerConfiguration } from 'angular-cesium';
import { GameFields } from '../../../types';
import { CharacterService, MeModelState, ViewState } from '../../services/character.service';
import { UtilsService } from '../../services/utils.service';
import { GameService } from '../../services/game.service';
import { environment } from '../../../../environments/environment';
import { CesiumViewerOptionsService } from './viewer-options/cesium-viewer-options.service';
import { CollisionDetectorService } from '../../services/collision-detector.service';

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

  @Input() private playersPositions: Observable<AcNotification>;
  @Input() private gameData: Observable<GameFields.Fragment>;
  @ViewChild(AcMapComponent) private mapInstance: AcMapComponent;

  public createPathMode = environment.createPathMode;
  private viewer: any;
  private lastPlayerLocation;
  private lastPlayerHPR: { heading: number, pitch: number, range: number };

  constructor(private gameService: GameService,
              private character: CharacterService,
              private viewerConf: ViewerConfiguration,
              private utils: UtilsService,
              private elementRef: ElementRef,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef,
              private viewerOptions: CesiumViewerOptionsService,
              private collisionDetector: CollisionDetectorService) {
    viewerConf.viewerOptions = viewerOptions.getViewerOption();

    viewerConf.viewerModifier = (viewer) => {
      this.viewer = viewer;
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
    this.character.viewState$.subscribe((viewState) => {
      if (viewState === ViewState.OVERVIEW) {
        this.changeToOverview();
      }
    });
    this.gameData.first().subscribe(game => {
      const overviewMode = game.me['__typename'] === 'Viewer' || game.me.type === 'OVERVIEW';
      if (overviewMode) {
        this.character.viewState = ViewState.OVERVIEW;
        this.overviewSettings();
        return;
      }

      this.character.initCharacter({
        id: 'me',
        location: this.utils.getPosition(game.me.currentLocation.location),
        heading: game.me.currentLocation.heading,
        pitch: GameMapComponent.DEFAULT_PITCH,
        state: game.me.state === 'DEAD' ? MeModelState.DEAD : MeModelState.WALKING,
        team: game.me.team,
        characterInfo:  game.me.character
      });
      this.gameService.startServerUpdatingLoop();

      this.viewer.scene.preRender.addEventListener(this.preRenderHandler);

      this.ngZone.runOutsideAngular(() => {
        this.elementRef.nativeElement.addEventListener('mousemove', this.onMousemove);
      });

      this.cd.detectChanges();
    });
  }

  private changeToOverview() {
    console.log('overview settings');
    this.overviewSettings();
    this.gameService.stopServerUpdatingLoop();
    this.elementRef.nativeElement.removeEventListener('mousemove', this.onMousemove);
    this.viewer.scene.preRender.removeEventListener(this.preRenderHandler);
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
    this.character.pitch = pitch - (event.movementY / 10);

    const heading = this.character.heading;
    this.character.heading = heading + (event.movementX / 10);
  }

  preRenderHandler() {
    if (!this.character.initialized) {
      return;
    }
    const isFPV = this.character.viewState === ViewState.FPV;
    const isShooting = this.character.state === MeModelState.SHOOTING;
    const range = isFPV || isShooting ? 0.1 : 3;

    if (this.lastPlayerLocation === this.character.location &&
      this.lastPlayerHPR.heading === this.character.heading &&
      this.lastPlayerHPR.pitch === this.character.pitch &&
      this.lastPlayerHPR.range === range) {
      return;
    }

    const pitchDeg = this.character.pitch;
    const pitch = Cesium.Math.toRadians(pitchDeg);
    const heading = Cesium.Math.toRadians(-180 + this.character.heading);

    const playerHead = new Cesium.Cartesian3(0.4174665722530335, -1.4575908118858933, 1.3042816752567887);
    Cesium.Cartesian3.add(this.character.location, playerHead, playerHead);

    this.viewer.camera.lookAt(playerHead, new Cesium.HeadingPitchRange(heading, pitch, range));
    this.lastPlayerLocation = this.character.location;
    this.lastPlayerHPR = { heading: this.character.heading, pitch: this.character.pitch, range };
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.removeEventListener('mousemove', this.onMousemove);
  }
}
