import { currentGame } from '../queries/current-game';
import { messages} from '../queries/flight';

const resolvers = {
  Query: {
    currentGame,
    messages,
  },
};

export default resolvers;
