import { IGameObject, IPlayer } from '../../../core/local-data/game';
import { IGraphQLContext } from '../../context';

const resolvers = {
  Game: {
    id: (game: IGameObject) => game.gameId,
    gameCode: (game: IGameObject) => game.gameCode,
    players: (game: IGameObject, args, { player }) => {
      const players = Array.from(game.playersMap.values());
      if (player) {
        const controlledPlayer = game.controlledPlayersMap.get(player.playerId);
        const playersToSend = players.filter((p: IPlayer) => p !== player && p !== controlledPlayer);
        return playersToSend
      }
      return players || [];
    },
    state: (game: IGameObject) => {
      const players = Array.from(game.playersMap.values());
      if (players.some(player => player.state === 'WAITING')) {
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
