import { gameData } from '../subscriptions/game-data';
import { gameNotifications } from '../subscriptions/game-notifications';
import { gunShot } from '../subscriptions/gun-shot';
import { messageAdded } from '../subscriptions/flight'
import { beenShot } from "../subscriptions/been-shot";

const resolvers = {
    Subscription: {
        gameData,
        gameNotifications,
        gunShot,
        messageAdded,
        beenShot
    },
};

export default resolvers;
