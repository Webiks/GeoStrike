import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { AngularCesiumModule } from 'angular-cesium';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdDialogModule } from '@angular/material';
import { CreateNewGameDialogComponent } from './create-new-game-dialog/create-new-game-dialog.component';
import { JoinGameDialogComponent } from './join-game-dialog/join-game-dialog.component';

@NgModule({
  declarations: [
    MainComponent,
    CreateNewGameDialogComponent,
    JoinGameDialogComponent
  ],
  imports: [
    BrowserModule,
    AngularCesiumModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdDialogModule,
  ],
  exports: [
    MainComponent,
  ],
  providers: [],
  entryComponents: [
    CreateNewGameDialogComponent,
    JoinGameDialogComponent,
  ],
})
export class GameModule {
}
