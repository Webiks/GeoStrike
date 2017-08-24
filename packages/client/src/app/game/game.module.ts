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
import { GameRoomComponent } from './views/game-room/game-room.component';
import { FormsModule } from '@angular/forms';
import { getApolloClient } from '../core/network/apollo-client';
import { ApolloModule } from 'apollo-angular';
import { client, SUBSCRIPTIONS_SOCKET } from '../core/network/websocket';
import { CharacterItemComponent } from './views/character-item/character-item.component';

@NgModule({
  declarations: [
    MainComponent,
    CreateNewGameDialogComponent,
    JoinGameDialogComponent,
    CharacterPickerComponent,
    GameRoomComponent,
    CharacterItemComponent,
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
    ApolloModule.forRoot(getApolloClient),
  ],
  exports: [
    MainComponent,
    GameRoomComponent,
  ],
  providers: [
    GameService,
    { provide: SUBSCRIPTIONS_SOCKET, useValue: client },
  ],
  entryComponents: [
    CreateNewGameDialogComponent,
    JoinGameDialogComponent,
  ],
})
export class GameModule {
}
