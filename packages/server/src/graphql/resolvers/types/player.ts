import { IPlayer } from '../../../core/local-data/game';
import { IGraphQLContext } from '../../context';

const resolvers = {
  Player: {
    id: (player: IPlayer) => player.playerId,
    character: (player: IPlayer) => player.character,
    username: (player: IPlayer) => player.username,
    state: (player: IPlayer) => player.state,
    isMe: (somePlayer: IPlayer, args, { player }: IGraphQLContext) => {
      return player && somePlayer.playerId === player.playerId;
    },
  },
};

export default resolvers;
