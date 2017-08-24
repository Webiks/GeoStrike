import { SubscriptionClient } from 'subscriptions-transport-ws';
import { InjectionToken } from '@angular/core';
import { AuthorizationMiddleware } from './authorization-middleware';

export const client = new SubscriptionClient('ws://localhost:3000/subscriptions', {
  reconnect: true,
  connectionParams: () => ({ 'player-token': AuthorizationMiddleware.token }),
});

export const SUBSCRIPTIONS_SOCKET = new InjectionToken<SubscriptionClient>('subscription.ws');
