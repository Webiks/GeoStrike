import { IGraphQLContext } from '../../context';

export const removeControlOverPlayer = (rootValue, _, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  return games.removeControlOverPlayer(game, player.playerId);
};
