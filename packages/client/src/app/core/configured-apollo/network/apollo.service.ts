import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Injectable , NgZone } from '@angular/core';
import { AuthorizationMiddleware } from './authorization-middleware';
import ApolloClient from 'apollo-client/ApolloClient';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ApolloService {

  private _subscriptionClient: SubscriptionClient;
  private _apolloClient: ApolloClient;

  constructor (ngZone: NgZone) {
    ngZone.runOutsideAngular(() => {
      this._subscriptionClient = new SubscriptionClient(`ws://${environment.serverUrl}/subscriptions` , {
        reconnect: true ,
        connectionParams: () => {
          if (!AuthorizationMiddleware.token || AuthorizationMiddleware.token === '') {
            return {};
          }

          return {'player-token': AuthorizationMiddleware.token};
        } ,
        connectionCallback: (error => {
          if (error) {
            AuthorizationMiddleware.setToken('');
            window.location.href = '/';
          }
        })
      });


      this._apolloClient = new ApolloClient({
        networkInterface: this._subscriptionClient ,
      });
    });
  }

  get subscriptionClient (): SubscriptionClient {
    return this._subscriptionClient;
  }

  get apolloClient (): ApolloClient {
    return this._apolloClient;
  }
}
