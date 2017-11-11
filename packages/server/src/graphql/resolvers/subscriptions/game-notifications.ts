import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { withFilter } from 'graphql-subscriptions';
import { IGraphQLContext } from '../../context';
import { createRejectionIterable } from 'subscriptions-transport-ws-temp/dist/utils/rejection-iterable';

export const gameNotifications = {
  subscribe: withFilter(
    (root, args, context: IGraphQLContext) => {
      if (!context.player || !context.game) {
        return createRejectionIterable(new Error('Invalid player, cant subscribe to the current game'))
      }
      return pubsub.asyncIterator(ESubscriptionTopics.GAME_NOTIFICATIONS)
    },
    (payload, args, context: IGraphQLContext) => {
      if (!context.player || !context.game) {
        return false;
      }

      return payload.gameNotifications.gameId === context.game.gameId;
    }
  )
};
