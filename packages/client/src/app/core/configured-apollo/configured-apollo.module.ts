import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { ApolloService } from './network/apollo.service';

export function ApolloFactory(client: ApolloService) {
  return new Apollo({ 'default': client.apolloClient });
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [ApolloService,
    {
      provide: Apollo,
      useFactory: ApolloFactory,
      deps: [ApolloService]
    }
  ]
})
export class ConfiguredApolloModule { }
