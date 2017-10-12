import { Notification } from '../../../types';

const resolver = {
  Notification: {
    message: (notification: Notification) => notification.message,
    gameId: (notification: Notification) => notification.gameId,
  }
};

export default resolver;
