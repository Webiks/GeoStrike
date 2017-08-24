import { IGameObject } from '../../../core/local-data/game';

const resolvers = {
  Game: {
    id: (game: IGameObject) => game.gameId,
    gameCode: (game: IGameObject) => game.gameCode,
  },
  CreateOrJoinResult: {
    game: result => result.game,
    playerToken: result => result.player.token,
  },
};

export default resolvers;
