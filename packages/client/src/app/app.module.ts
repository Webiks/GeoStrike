import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.module.routing';
import { KeyboardKeysService } from './core/services/keyboard-keys.service';
import { HttpModule } from '@angular/http';
import { ConfiguredApolloModule } from './core/configured-apollo/configured-apollo.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AppRoutingModule,
    ConfiguredApolloModule,
  ],
  providers: [KeyboardKeysService],
  bootstrap: [AppComponent]
})
export class AppModule { }
