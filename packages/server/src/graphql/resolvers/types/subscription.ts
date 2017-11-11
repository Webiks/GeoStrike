import { gameData } from '../subscriptions/game-data';
import { gameNotifications } from '../subscriptions/game-notifications';
import { gunShot } from '../subscriptions/gun-shot';

const resolvers = {
  Subscription: {
    gameData,
    gameNotifications,
    gunShot,
  },
};

export default resolvers;
