import { IGraphQLContext } from '../../context';

export const createNewGame = (rootValue, {character, username, team, isViewer, terrainType}, {games}: IGraphQLContext) => {
  console.log("terrainType:"+terrainType);
  const game = games.createNewGame(terrainType);

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
