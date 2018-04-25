import { currentGame } from '../queries/current-game';

const resolvers = {
  Query: {
    currentGame,
  },
};

export default resolvers;
