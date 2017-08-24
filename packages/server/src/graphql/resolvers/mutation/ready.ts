import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';

export const ready = (rootValue, args, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  games.playerReady(game.gameId, player.playerId);

  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, { gameData: game });

  return game;
};
