import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { withFilter } from 'graphql-subscriptions';

export const gameData = {
  subscribe: withFilter(() => pubsub.asyncIterator(ESubscriptionTopics.GAME_STATE_CHANGED),
    (payload, args, context) => {
      if (!context.player || !context.game) {
        return false;
      }
      return payload.gameData.gameId === context.game.gameId;
    })
};