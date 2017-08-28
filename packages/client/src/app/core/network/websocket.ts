import { SubscriptionClient } from 'subscriptions-transport-ws';
import { InjectionToken } from '@angular/core';
import { AuthorizationMiddleware } from './authorization-middleware';

export const client = new SubscriptionClient('ws://192.168.1.11:3000/subscriptions', {
  reconnect: true,
  connectionParams: () => {
    if (!AuthorizationMiddleware.token || AuthorizationMiddleware.token === '') {
      return {};
    }

    return { 'player-token': AuthorizationMiddleware.token };
  },
  connectionCallback: (error => {
    if (error) {
      AuthorizationMiddleware.setToken('');
      window.location.href = '/';
    }
  })
});

export const SUBSCRIPTIONS_SOCKET = new InjectionToken<SubscriptionClient>('subscription.ws');
