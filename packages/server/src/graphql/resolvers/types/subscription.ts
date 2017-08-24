import { ESubscriptionTopics, pubsub } from '../../pubsub';

const resolvers = {
  Subscription: {
    gameData: {
      subscribe: () => pubsub.asyncIterator(ESubscriptionTopics.GAME_STATE_CHANGED),
    },
  },
};

export default resolvers;
