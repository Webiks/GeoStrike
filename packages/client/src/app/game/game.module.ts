import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularCesiumModule } from 'angular-cesium';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule ,
  MdCardModule ,
  MdDialogModule ,
  MdGridListModule ,
  MdInputModule ,
  MdProgressSpinnerModule
} from '@angular/material';

import { MainComponent } from './views/main/main.component';
import { CreateNewGameDialogComponent } from './views/create-new-game-dialog/create-new-game-dialog.component';
import { JoinGameDialogComponent } from './views/join-game-dialog/join-game-dialog.component';
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
import { ConfiguredApolloModule } from '../core/configured-apollo/configured-apollo.module';
import { EndGameDialogComponent } from './views/end-game-dialog/end-game-dialog.component';

@NgModule({
  declarations: [
    MainComponent ,
    CreateNewGameDialogComponent ,
    JoinGameDialogComponent ,
    CharacterPickerComponent ,
    GameRoomComponent ,
    CharacterItemComponent ,
    GameContainerComponent ,
    GameCountdownComponent ,
    GameMapComponent ,
    KeyboardControlComponent ,
    MeComponent ,
    WorldComponent ,
    OtherPlayersComponent,
    EndGameDialogComponent,
  ] ,
  imports: [
    BrowserModule ,
    AngularCesiumModule ,
    BrowserAnimationsModule ,
    MdButtonModule ,
    MdCardModule ,
    MdDialogModule ,
    MdGridListModule ,
    MdProgressSpinnerModule ,
    MdInputModule ,
    FormsModule ,
    ConfiguredApolloModule ,
  ] ,
  exports: [
    MainComponent ,
    GameRoomComponent ,
  ] ,
  providers: [
    GameService ,
    UtilsService ,
    CharacterService ,
  ] ,
  entryComponents: [
    CreateNewGameDialogComponent ,
    JoinGameDialogComponent ,
    EndGameDialogComponent,
  ] ,
})
export class GameModule {
}
