import { IGraphQLContext } from '../../context';

export const updatePosition = (rootValue, { position, heading,isCrawling, skipValidation }, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  const controlledPlayers = Array.from(game.controlledPlayersMap.values());
  if (controlledPlayers.find(p => p.playerId === player.playerId)) {
    return;
  }

  let playerId = player.playerId;
  if (game.controlledPlayersMap.has(player.playerId)) {
    playerId = game.controlledPlayersMap.get(player.playerId).playerId;
  }
  const updatedPlayer =games.updatePlayerPosition(game.gameId, playerId, position, heading,isCrawling, skipValidation);

  return updatedPlayer;
};
