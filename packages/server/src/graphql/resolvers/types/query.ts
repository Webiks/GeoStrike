import { gameById } from '../queries/game-by-id';

const resolvers = {
  Query: {
    game: gameById,
  },
};

export default resolvers;
