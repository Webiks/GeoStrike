import { IGraphQLContext } from '../../context';

export const gameById = (rootValue, { gameId }, { games }: IGraphQLContext) => {
  return games.getGameById(gameId);
};
