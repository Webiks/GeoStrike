import { GamesManager, IGameObject, IPlayer } from '../core/local-data/game';
import { decode } from 'jsonwebtoken';

export interface IGraphQLContext {
  games: GamesManager;
}

export const createContext = (): IGraphQLContext => {
  return {
    games: new GamesManager(),
  };
};

export const resolveGameAndPlayer = (headerValue: string, games: GamesManager): { game?: IGameObject, player?: IPlayer } => {
  if (headerValue) {
    const decodedPlayerToken: { gameId: string, playerId: string } = decode(headerValue) as any;

    if (decodedPlayerToken) {
      const game = games.getGameById(decodedPlayerToken.gameId);

      if (game) {
        const player = game.players.find(p => p.playerId === decodedPlayerToken.playerId);

        if (player) {
          return {
            game,
            player,
          };
        } else {
          throw new Error('Invalid player id!');
        }
      } else {
        throw new Error('Invalid game!');
      }
    } else {
      throw new Error('Invalid token!');
    }
  }

  return {};
};
