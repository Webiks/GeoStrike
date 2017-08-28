import { createNewGame } from '../mutation/create-new-game';
import { joinGame } from '../mutation/join-game';
import { ready } from '../mutation/ready';
import { updatePosition } from '../mutation/update-position';

const resolvers = {
  Mutation: {
    createNewGame,
    joinGame,
    ready,
    updatePosition,
  },
};

export default resolvers;
