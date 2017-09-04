import { IGraphQLContext } from '../../context';

export const createNewGame = (rootValue, { character, username, team }, { games }: IGraphQLContext) => {
  const game = games.createNewGame();
  const player = games.addPlayerToGame(game.gameId, character, username, team);

  return {
    game,
    player,
  };
};
