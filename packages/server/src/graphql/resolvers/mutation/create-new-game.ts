import { IGraphQLContext } from '../../context';

export const createNewGame = (rootValue, args, { games }: IGraphQLContext) => {
  return games.createNewGame();
};
