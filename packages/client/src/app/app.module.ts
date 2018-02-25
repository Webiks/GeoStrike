import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.module.routing';
import { KeyboardKeysService } from './core/services/keyboard-keys.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ConfiguredApolloModule } from './core/configured-apollo/configured-apollo.module';
import { MATERIAL_COMPATIBILITY_MODE } from '@angular/material';
import { SnackBarContentComponent } from './shared/snack-bar-content/snack-bar-content.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ConfiguredApolloModule,
  ],
  providers: [
    KeyboardKeysService,
    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
  ],
  bootstrap: [
    AppComponent,
  ],
  entryComponents: [
    SnackBarContentComponent,
  ]
})
export class AppModule { }
