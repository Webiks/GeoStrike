import { IGraphQLContext } from '../../context';
import { IPlayer } from '../../../core/local-data/game-manager';

export const toggleFlightMode = (rootValue, { playerId, isFlying }, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  let flyingPlayer = ((game.controlledPlayersMap.get(playerId) || player) as IPlayer);
  // flyingPlayer.flight.flightId =
  console.log(isFlying);
  console.log(flyingPlayer.flight.flightId);
  if(isFlying)
  {
      flyingPlayer.flight.flightId =  setInterval(( ()=> flyingPlayer.flight.remainingTime-=1),1000);
  }
  else
  {
    clearInterval(flyingPlayer.flight.flightId);
  }
}

