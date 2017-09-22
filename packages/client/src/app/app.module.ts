import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.module.routing';
import { KeyboardKeysService } from './core/services/keyboard-keys.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [KeyboardKeysService],
  bootstrap: [AppComponent]
})
export class AppModule { }
