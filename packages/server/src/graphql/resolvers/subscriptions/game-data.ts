import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { createRejectionIterable } from 'subscriptions-transport-ws/dist/utils/rejection-iterable';

export const gameData = {
  subscribe: (rootValue, args, context) => {
    if (!context.player || !context.game) {
      return createRejectionIterable(new Error(`Invalid state!`));
    }

    return pubsub.asyncIterator(ESubscriptionTopics.GAME_STATE_CHANGED);
  },
};