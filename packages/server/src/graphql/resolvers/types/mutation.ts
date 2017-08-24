import { createNewGame } from '../mutation/create-new-game';
import { joinGame } from '../mutation/join-game';
import { ready } from '../mutation/ready';

const resolvers = {
  Mutation: {
    createNewGame,
    joinGame,
    ready,
  },
};

export default resolvers;
