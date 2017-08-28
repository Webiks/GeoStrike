import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';

export const updatePosition = (rootValue, { position }, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  games.updatePlayerPosition(game.gameId, player.playerId, position);

  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, { gameData: game });

  return game;
};
