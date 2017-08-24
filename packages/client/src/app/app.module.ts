import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ApolloModule } from 'apollo-angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.module.routing';
import { getApolloClient } from './core/network/apollo-client';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApolloModule.forRoot(getApolloClient),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
