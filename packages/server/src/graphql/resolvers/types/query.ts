import { currentGame } from '../queries/current-game';
import { airTraffic} from '../queries/airTraffic';

const resolvers = {
  Query: {
    currentGame,
    airTraffic,
  },
};

export default resolvers;
