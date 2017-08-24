import { GamesManager } from '../core/local-data/game';

export interface IGraphQLContext {
  games: GamesManager;
}

export const createContext = (): IGraphQLContext => {
  return {
    games: new GamesManager(),
  };
};
