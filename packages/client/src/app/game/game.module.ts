import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularCesiumModule } from 'angular-cesium';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule, MdCardModule, MdDialogModule, MdGridListModule, MdInputModule,
  MdProgressSpinnerModule
} from '@angular/material';

import { MainComponent } from './views/main/main.component';
import { CreateNewGameDialogComponent } from './views/create-new-game-dialog/create-new-game-dialog.component';
import { JoinGameDialogComponent } from './views/join-game-dialog/join-game-dialog.component';
import { CharacterPickerComponent } from './views/character-picker/character-picker.component';
import { GameService } from './services/game.service';
import { ActiveGameService } from './services/active-game.service';
import { GameRoomComponent } from './views/game-room/game-room.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MainComponent,
    CreateNewGameDialogComponent,
    JoinGameDialogComponent,
    CharacterPickerComponent,
    GameRoomComponent,
  ],
  imports: [
    BrowserModule,
    AngularCesiumModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
    MdGridListModule,
    MdProgressSpinnerModule,
    MdInputModule,
    FormsModule,
  ],
  exports: [
    MainComponent,
    GameRoomComponent,
  ],
  providers: [
    GameService,
    ActiveGameService,
  ],
  entryComponents: [
    CreateNewGameDialogComponent,
    JoinGameDialogComponent,
  ],
})
export class GameModule {
}
