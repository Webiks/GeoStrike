import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';

export const notifyKill = (rootValue, { playerId }, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  games.updatePlayerState(game.gameId, playerId, 'DEAD');
  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, { gameData: game });

  console.log(game);
  return player;
};
