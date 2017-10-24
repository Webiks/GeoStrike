import { SubscriptionClient } from 'subscriptions-transport-ws-temp';
import { Injectable, NgZone } from '@angular/core';
import { AuthorizationMiddleware } from './authorization-middleware';
import ApolloClient from 'apollo-client/ApolloClient';
import { environment } from '../../../../environments/environment';
import { IntrospectionFragmentMatcher } from 'apollo-client';

@Injectable()
export class ApolloService {

  private _subscriptionClient: SubscriptionClient;
  private _apolloClient: ApolloClient;


  constructor(ngZone: NgZone) {
    ngZone.runOutsideAngular(() => {
      this._subscriptionClient = new SubscriptionClient(`${environment.wsSchema}://${environment.serverUrl}/subscriptions`, {
        reconnect: true,
        minTimeout: 5000,
        connectionParams: () => {
          if (!AuthorizationMiddleware.token || AuthorizationMiddleware.token === '') {
            return {};
          }

          return {'player-token': AuthorizationMiddleware.token};
        },
        connectionCallback: (error => {
          if (error) {
            AuthorizationMiddleware.setToken('');
            window.location.href = '/';
          }
        })
      });

      const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData: {
          __schema: {
            types: [
              {
                'kind': 'INTERFACE',
                'name': 'User',
                'possibleTypes': [
                  {'name': 'Player'},
                  {'name': 'Viewer'}
                ]
              },
            ],
          },
        }
      });

      // this._subscriptionClient.onDisconnected((x)=> {console.log('disconected',x)});
      // this._subscriptionClient.onConnected(()=>console.log('connected'));
      // this._subscriptionClient.onConnecting(()=>console.log('connecting...'));
      // this._subscriptionClient.onReconnected(()=>console.log('reconnected'));
      // this._subscriptionClient.onReconnect(()=>console.log('reconnect'));
      // this._subscriptionClient.onReconnecting(()=>console.log('reconnecting'));


      this._apolloClient = new ApolloClient({
        networkInterface: this._subscriptionClient,
        fragmentMatcher: fragmentMatcher,
      });
    });
  }

  get subscriptionClient(): SubscriptionClient {
    return this._subscriptionClient;
  }

  get apolloClient(): ApolloClient {
    return this._apolloClient;
  }
}
