import { IGraphQLContext } from '../../context';

export const currentGame = (rootValue, args, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    throw new Error(`Invalid state!`);
  }

  return game || null;
};
