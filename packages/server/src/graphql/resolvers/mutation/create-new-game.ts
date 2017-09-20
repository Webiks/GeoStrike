import { IGraphQLContext } from '../../context';

export const createNewGame = (rootValue, { character, username, team }, { games }: IGraphQLContext) => {
  const game = games.createNewGame();
  const player = games.addRealPlayerToGame(game.gameId, character, username, team);

  return {
    game,
    player,
  };
};
