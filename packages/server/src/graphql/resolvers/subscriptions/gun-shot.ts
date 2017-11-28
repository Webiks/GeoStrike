import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { withFilter } from 'graphql-subscriptions';
import { IGraphQLContext } from '../../context';
import { createRejectionIterable } from 'subscriptions-transport-ws-temp/dist/utils/rejection-iterable';

export const gunShot = {
  subscribe: withFilter(
    (root, args, context: IGraphQLContext) => {
      if (!context.player || !context.game) {
        return createRejectionIterable(new Error('Invalid player, cant subscribe to the current game'))
      }
      return pubsub.asyncIterator(ESubscriptionTopics.GUN_SHOT)
    },
    (payload, args, context: IGraphQLContext) => {
      if (!context.player || !context.game) {
        return false;
      }

      const controlledPlayer = context.game.controlledPlayersMap.get(context.player.playerId);

      // console.log('playerId ' + payload.gunShot.byPlayer.playerId,'  ',context.player.playerId);
      // Send to all players in the same game except the player that made the shot

      // payload.gunShot.byPlayer.playerId !== context.player.playerId &&
      // && (!controlledPlayer || payload.gunShot.byPlayer.playerId !== controlledPlayer.playerId);
      return payload.gunShot.gameId === context.game.gameId;
    }
  )
};
