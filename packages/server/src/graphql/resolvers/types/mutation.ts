import { createNewGame } from '../mutation/create-new-game';
import { joinGame } from '../mutation/join-game';
import { ready } from '../mutation/ready';
import { updatePosition } from '../mutation/update-position';
import { notifyKill } from '../mutation/notify-kill';
import { joinAsViewer } from '../mutation/join-as-viewer';

const resolvers = {
  Mutation: {
    createNewGame,
    joinGame,
    ready,
    updatePosition,
    notifyKill,
    joinAsViewer,
  },
};

export default resolvers;
