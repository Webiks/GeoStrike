import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';

export const joinGame = (rootValue, { gameCode, character, username, team }, { games }: IGraphQLContext) => {
  const game = games.getGameByCode(gameCode);
  const player = games.addPlayerToGame(game.gameId, character, username, team);

  pubsub.publish(ESubscriptionTopics.GAME_STATE_CHANGED, { gameData: game });

  return {
    game,
    player,
  };
};
