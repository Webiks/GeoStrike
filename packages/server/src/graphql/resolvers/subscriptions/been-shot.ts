import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { withFilter } from 'graphql-subscriptions';
import { IGraphQLContext } from '../../context';
import { createRejectionIterable } from 'subscriptions-transport-ws-temp/dist/utils/rejection-iterable';

export const beenShot = {
    subscribe: withFilter(
        (root, args, context: IGraphQLContext) => {
            if (!context.player || !context.game) {
                return createRejectionIterable(new Error('Invalid player, cant subscribe to the current game'))
            }
            return pubsub.asyncIterator(ESubscriptionTopics.BEEN_SHOT)
        },
        (payload, args, context: IGraphQLContext) => {
            if (!context.player || !context.game) {
                return false;
            }
            return payload.beenShot.gameId === context.game.gameId && payload.beenShot.id === context.player.playerId
        }
    )
};
