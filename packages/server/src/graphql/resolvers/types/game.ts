import { IGameObject } from '../../../core/local-data/game';

const resolvers = {
  Game: {
    id: (game: IGameObject) => game.gameId,
    gameCode: (game: IGameObject) => game.gameCode,
  },
};

export default resolvers;
