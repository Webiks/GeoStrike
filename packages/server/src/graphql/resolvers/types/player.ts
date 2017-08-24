import { IPlayer } from '../../../core/local-data/game';

const resolvers = {
  Player: {
    id: (player: IPlayer) => player.playerId,
    character: (player: IPlayer) => player.character,
    username: (player: IPlayer) => player.username,
  },
};

export default resolvers;
