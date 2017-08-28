import { IGraphQLContext } from '../../context';
import { Team } from '../../../core/local-data/game';

export const createNewGame = (rootValue, { character, username }, { games }: IGraphQLContext) => {
  const game = games.createNewGame();
  const player = games.addPlayerToGame(game.gameId, character, username, Team.RED);

  return {
    game,
    player,
  };
};
