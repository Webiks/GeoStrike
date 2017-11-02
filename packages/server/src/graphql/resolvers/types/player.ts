import { IPlayer, IViewer } from '../../../core/local-data/game-manager';
import { IGraphQLContext } from '../../context';

const resolvers = {
  Player: {
    id: (player: IPlayer) => player.playerId,
    character: (player: IPlayer) => player.character,
    username: (player: IPlayer) => player.username,
    team: (player: IPlayer) => {
      return player.team
    },
    syncState: (player: IPlayer) => player.syncState,
    state: (player: IPlayer) => {
        return player.state;
    },
    currentLocation: (player: IPlayer) => ({
      location: player.currentLocation,
      heading: player.heading,
    }),
    isMe: (somePlayer: IPlayer, args, { player }: IGraphQLContext) => {
      return player !== undefined && somePlayer.playerId === player.playerId;
    },
  },

  Viewer: {
    id: (viewer: IViewer)=> viewer.playerId,
  }
};

export default resolvers;
