import { IGameObject } from '../../../core/local-data/game';
import { IGraphQLContext } from '../../context';

const resolvers = {
  Game: {
    id: (game: IGameObject) => game.gameId,
    gameCode: (game: IGameObject) => game.gameCode,
    players: (game: IGameObject, args, { player }) => {
      if (player) {
        return game.players.filter(p => p.playerId !== player.playerId);
      }

      return game.players || [];
    },
    state: (game: IGameObject) => {
      if (game.players.some(player => player.state === 'WAITING')) {
        return 'WAITING';
      }

      return 'ACTIVE';
    },
    me: (game: IGameObject, args, { player }: IGraphQLContext) => player || null,
  },
  CreateOrJoinResult: {
    game: result => result.game,
    player: result => result.player,
    playerToken: result => result.player.token,
  },
};

export default resolvers;
