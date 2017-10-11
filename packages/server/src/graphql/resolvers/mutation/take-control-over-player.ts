import { IGraphQLContext } from '../../context';

export const takeControlOverPlayer = (rootValue, { playerId }, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  return games.takeControlOverPlayer(game, player.playerId, playerId);
};
