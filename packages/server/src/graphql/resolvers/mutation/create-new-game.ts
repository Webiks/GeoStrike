import { IGraphQLContext } from '../../context';

export const createNewGame = (rootValue, {character, username, team, isViewer}, {games}: IGraphQLContext) => {
  const game = games.createNewGame();

  let player = null;
  if (isViewer) {
    player = games.addViewerToGame(game.gameId, username);
  }
  else {
    player = games.addRealPlayerToGame(game.gameId, character, username, team);
    const player2 = games.addRealPlayerToGame(game.gameId, character, username, team);
    games.playerReady(game.gameId,player2.playerId);
  }

  return {
    game,
    player,
  };
};
