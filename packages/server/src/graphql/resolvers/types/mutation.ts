import { createNewGame } from '../mutation/create-new-game';
import { joinGame } from '../mutation/join-game';
import { ready } from '../mutation/ready';
import { updatePosition } from '../mutation/update-position';
import { notifyKill } from '../mutation/notify-kill';
import { joinAsViewer } from '../mutation/join-as-viewer';
import { takeControlOverPlayer } from '../mutation/take-control-over-player';
import { removeControlOverPlayer } from '../mutation/remove-control-over-player';
import { notifyShot } from '../mutation/notify-shot';
import { toggleFlightMode } from "../mutation/toggle-flight-mode";
import { notifyCrash } from "../mutation/notify-crash";

const resolvers = {
    Mutation: {
        createNewGame,
        joinGame,
        ready,
        updatePosition,
        notifyKill,
        notifyCrash,
        notifyShot,
        toggleFlightMode,
        joinAsViewer,
        takeControlOverPlayer,
        removeControlOverPlayer,
    },
};

export default resolvers;
