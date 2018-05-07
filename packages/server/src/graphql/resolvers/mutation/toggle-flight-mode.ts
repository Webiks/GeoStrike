import { IGraphQLContext } from '../../context';
import { IPlayer } from '../../../core/local-data/game-manager';

export const toggleFlightMode = (rootValue, {playerId, isFlying}, {games, game, player}: IGraphQLContext) => {
    if (!game || !player) {
        return null;
    }
    let flyingPlayer = ((game.controlledPlayersMap.get(playerId) || player) as IPlayer);
    if (isFlying && flyingPlayer.flight) {
        flyingPlayer.flight.flightId = setInterval((() => flyingPlayer.flight.remainingTime -= 1), 1000);
    }
    else if(!isFlying && flyingPlayer.flight) {
        clearInterval(flyingPlayer.flight.flightId);
    }
}

