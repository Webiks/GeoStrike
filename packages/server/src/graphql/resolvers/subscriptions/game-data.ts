import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { withFilter } from 'graphql-subscriptions';
import { IGraphQLContext } from '../../context';
import { createRejectionIterable } from 'subscriptions-transport-ws/dist/utils/rejection-iterable';

export const gameData = {
  subscribe: withFilter(
    (root, args, context: IGraphQLContext) => {
      if (!context.player || !context.game) {
        return createRejectionIterable(new Error('Invalid player, cant subscribe to the current game'))
      }
      return pubsub.asyncIterator(ESubscriptionTopics.GAME_STATE_CHANGED)
    },
    (payload, args, context) => {
      if (!context.player || !context.game) {
        return false;
      }
      return payload && payload.gameData && payload.gameData.gameId === context.game.gameId;
    }
  )
};
