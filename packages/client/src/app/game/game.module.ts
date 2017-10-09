import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularCesiumModule } from 'angular-cesium';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdCardModule,
  MdDialogModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdProgressSpinnerModule,
  MdSnackBarModule
} from '@angular/material';

import { MainComponent } from './views/main/main.component';
import { JoinGameDialogComponent } from './views/join-game-dialog/join-game-dialog.component';
import { CharacterPickerComponent } from './views/character-picker/character-picker.component';
import { GameService } from './services/game.service';
import { GameRoomComponent } from './views/game-room/game-room.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    MainComponent,
    JoinGameDialogComponent,
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
  ],
  imports: [
    BrowserModule,
    AngularCesiumModule,
    SharedModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
    MdGridListModule,
    MdProgressSpinnerModule,
    MdInputModule,
    MdIconModule,
    MdSnackBarModule,
    FormsModule,
  ],
  exports: [
    MainComponent,
    GameRoomComponent,
  ],
  providers: [
    GameService,
    CharacterService,
    UtilsService,
  ],
  entryComponents: [
    JoinGameDialogComponent,
    EndGameDialogComponent,
    HowToPlayDialogComponent,
  ],
})
export class GameModule {
}
