import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';

export const joinGame = (rootValue, { gameCode, character }, { games }: IGraphQLContext) => {
  const game = games.getGameByCode(gameCode);
  const player = games.addPlayerToGame(game.gameId, character);

  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, { gameData: game });

  return {
    game,
    player,
  };
};
