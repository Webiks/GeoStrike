import { IGraphQLContext } from '../../context';

export const updatePosition = (rootValue, { position, heading }, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  games.updatePlayerPosition(game.gameId, player.playerId, position, heading);

  return player;
};
