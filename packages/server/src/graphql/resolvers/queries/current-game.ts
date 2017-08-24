import { IGraphQLContext } from '../../context';

export const currentGame = (rootValue, args, { games, game, player }: IGraphQLContext) => {
  return game || null;
};
