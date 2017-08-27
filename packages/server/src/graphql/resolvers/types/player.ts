import { IPlayer } from '../../../core/local-data/game';
import { IGraphQLContext } from '../../context';

const resolvers = {
  Player: {
    id: (player: IPlayer) => player.playerId,
    character: (player: IPlayer) => player.character,
    username: (player: IPlayer) => player.username,
    state: (player: IPlayer) => {
      const otherWaiting = player.game.players.some(p => p.state === 'WAITING');

      if (otherWaiting) {
        return player.state;
      } else {
        return 'ALIVE';
      }
    },
    initialLocation: (player: IPlayer) => ({
      location: player.initialLocation,
      heading: 0,
    }),
    currentLocation: (player: IPlayer) => ({
      location: player.currentLocation,
      heading: player.heading,
    }),
    isMe: (somePlayer: IPlayer, args, { player }: IGraphQLContext) => {
      return player !== undefined && somePlayer.playerId === player.playerId;
    },
  },
};

export default resolvers;
