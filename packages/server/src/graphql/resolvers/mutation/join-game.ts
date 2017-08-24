import { IGraphQLContext } from '../../context';

export const joinGame = (rootValue, { gameCode, character }, { games }: IGraphQLContext) => {
  const game = games.getGameByCode(gameCode);
  const player = games.addPlayerToGame(game.gameId, character);

  return {
    game,
    player,
  };
};
