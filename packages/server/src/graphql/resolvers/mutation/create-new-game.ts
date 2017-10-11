import { IGraphQLContext } from '../../context';
import { Team } from '../../../core/local-data/game';

export const createNewGame = (rootValue, {character, username, team, isViewer}, {games}: IGraphQLContext) => {
  const game = games.createNewGame();

  const player1 = games.addRealPlayerToGame(game.gameId, 'Peter Parker', 'asad',  Team.RED);
  games.playerReady(game.gameId,player1.playerId);

  let player = null;
  if (isViewer) {
    player = games.addViewerToGame(game.gameId, username);
  }
  else {
    player = games.addRealPlayerToGame(game.gameId, character, username, team);
  }

  return {
    game,
    player,
  };
};
