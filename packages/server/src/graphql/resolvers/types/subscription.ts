import { gameData } from '../subscriptions/game-data';
import { gameNotifications } from '../subscriptions/game-notifications';

const resolvers = {
  Subscription: {
    gameData,
    gameNotifications,
  },
};

export default resolvers;
