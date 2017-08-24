import { createNewGame } from '../mutation/create-new-game';
import { joinGame } from '../mutation/join-game';

const resolvers = {
  Mutation: {
    createNewGame,
    joinGame,
  },
};

export default resolvers;
