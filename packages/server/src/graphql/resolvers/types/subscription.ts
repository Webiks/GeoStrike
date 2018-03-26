import { gameData } from '../subscriptions/game-data';
import { gameNotifications } from '../subscriptions/game-notifications';
import { gunShot } from '../subscriptions/gun-shot';
import {messageAdded} from  '../subscriptions/flight'

const resolvers = {
  Subscription: {
    gameData,
    gameNotifications,
    gunShot,
    messageAdded,
  },
};

export default resolvers;
