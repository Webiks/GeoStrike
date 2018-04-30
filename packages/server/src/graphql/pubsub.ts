import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

export const ESubscriptionTopics = {
  GAME_STATE_CHANGED: 'GAME_STATE_CHANGED',
  GAME_NOTIFICATIONS: 'GAME_NOTIFICATIONS',
  GUN_SHOT: 'GUN_SHOT',
  BEEN_SHOT: 'BEEN_SHOT'
};
