import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularCesiumModule } from 'angular-cesium';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTabsModule,
} from '@angular/material';

import { MainComponent } from './views/main/main.component';
import { CharacterPickerComponent } from './views/character-picker/character-picker.component';
import { GameService } from './services/game.service';
import { GameRoomComponent } from './views/game-room/game-room.component';
import { FormsModule } from '@angular/forms';
import { CharacterItemComponent } from './views/character-item/character-item.component';
import { GameContainerComponent } from './views/game-container/game-container.component';
import { GameCountdownComponent } from './views/game-countdown/game-countdown.component';
import { GameMapComponent } from './views/game-map/game-map.component';
import { KeyboardControlComponent } from './views/game-map/keyboard-control/keyboard-control.component';
import { MeComponent } from './views/game-map/me/me.component';
import { CharacterService } from './services/character.service';
import { WorldComponent } from './views/game-map/world/world.component';
import { OtherPlayersComponent } from './views/game-map/other-players/other-players.component';
import { UtilsService } from './services/utils.service';
import { EndGameDialogComponent } from './views/end-game-dialog/end-game-dialog.component';
import { HowToPlayDialogComponent } from './views/how-to-play-dialog/how-to-play-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { PathCreatorComponent } from './views/game-map/path-creator/path-creator.component';
import { GameToolbarComponent } from './views/game-container/game-toolbar/game-toolbar.component';
import { TeamInfoBarComponent } from './views/game-container/team-info-bar/team-info-bar.component';
import { PlayerDetailsComponent } from './views/game-container/player-details/player-details.component';
import { YouWinDialogComponent } from './views/you-win-dialog/you-win-dialog.component';
import { GameDialogsComponent } from './views/game-container/game-dialogs/game-dialogs.component';
import { BuildingsComponent } from './views/buildings/buildings.component';
import { BuildingsService } from './services/buildings.service';
import { CollisionDetectorService } from './services/collision-detector.service';
import { ViewerControlsComponent } from './views/game-container/viewer-controls/viewer-controls.component';
import { BenchedDialogComponent } from './views/benched-dialog/benched-dialog.component';
import { KeyButtonComponent } from './views/how-to-play-dialog/key-button/key-button.component';
import { ArrowKeysComponent } from './views/how-to-play-dialog/arrow-keys/arrow-keys.component';
import { OtherPlayersGunSoundComponent } from './views/game-map/other-players/gun-shot/other-players-gun-sound/other-players-gun-sound.component';
import { GunIndicatorComponent } from './views/game-map/other-players/gun-shot/gun-indicator/gun-indicator.component';
import { SoundService } from './services/sound.service';
import { FlightModeComponent } from './views/game-container/flight-mode/flight-mode.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { GameCreditsComponent } from './views/game-container/game-credits/game-credits.component';
import { CreditsDialogComponent } from './views/credits-dialog/credits-dialog.component';
import { BloodOnScreen } from './views/game-container/blood-on-screen/blood-on-screen';
import { FlightModeService } from './views/game-container/flight-mode/flight-mode.service';
import { FlightIndicator } from "./views/game-map/other-players/flight/flight-indicator.component";
import { MapProviderComponent } from './views/game-map/map-provider/map-provider.component';

@NgModule({
  declarations: [
    MainComponent,
    CharacterPickerComponent,
    GameRoomComponent,
    CharacterItemComponent,
    GameContainerComponent,
    GameCountdownComponent,
    GameMapComponent,
    KeyboardControlComponent,
    MeComponent,
    WorldComponent,
    OtherPlayersComponent,
    EndGameDialogComponent,
    PathCreatorComponent,
    HowToPlayDialogComponent,
    GameToolbarComponent,
    TeamInfoBarComponent,
    PlayerDetailsComponent,
    YouWinDialogComponent,
    BuildingsComponent,
    GameDialogsComponent,
    ViewerControlsComponent,
    BenchedDialogComponent,
    KeyButtonComponent,
    ArrowKeysComponent,
    OtherPlayersGunSoundComponent,
    GunIndicatorComponent,
    GameCreditsComponent,
    CreditsDialogComponent,
    BloodOnScreen,
    FlightModeComponent,
    FlightIndicator,
    MapProviderComponent
  ],
  imports: [
    BrowserModule,
    AngularCesiumModule,
    SharedModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatTabsModule,
    ClickOutsideModule,
  ],
  exports: [
    MainComponent,
    GameRoomComponent,
  ],
  providers: [
    GameService,
    CharacterService,
    UtilsService,
    BuildingsService,
    CollisionDetectorService,
    SoundService,
    FlightModeService
  ],
  entryComponents: [
    EndGameDialogComponent,
    HowToPlayDialogComponent,
    YouWinDialogComponent,
    BenchedDialogComponent,
    CreditsDialogComponent
  ],
})
export class GameModule {
}
