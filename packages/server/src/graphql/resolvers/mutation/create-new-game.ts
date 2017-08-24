import { IGraphQLContext } from '../../context';

export const createNewGame = (rootValue, { character, username }, { games }: IGraphQLContext) => {
  const game = games.createNewGame();
  const player = games.addPlayerToGame(game.gameId, character, username);

  return {
    game,
    player,
  };
};
