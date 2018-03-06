import { IGraphQLContext } from '../../context';
import { ESubscriptionTopics, pubsub } from '../../pubsub';
import { CharacterType, IGameObject, IPlayer, IViewer } from '../../../core/local-data/game-manager';

export const toggleFlightMode = (rootValue, { playerId, isFlying }, { games, game, player }: IGraphQLContext) => {
  if (!game || !player) {
    return null;
  }

  const flyingPlayer = ((game.controlledPlayersMap.get(playerId) || player) as IPlayer);
  let intervalId;
  // console.log("before interval"+isFlying,"this.intervalId:"+this.intervalId);
  if(isFlying)
  {
    // notifyOtherPlayers(player, game);
    this.intervalId =  setInterval(( ()=> flyingPlayer.flight.remainingTime-=1),1000);
  }
  else
  {
    clearInterval(this.intervalId);
  }

    // console.log("test"+flyingPlayer.flight.remainingTime+flyingPlayer.isFlying+isFlying);
}


const notifyOtherPlayers = (player: IPlayer | IViewer, game: IGameObject) => {
    const color = (player as IPlayer).team ? (player as IPlayer).team.toString().toLowerCase() : '';
    const message =
        `<span style="color:${color}">${player.username}</span> <span>has joined the game</span>`;
    pubsub.publish(ESubscriptionTopics.GAME_NOTIFICATIONS, {gameNotifications: {message, gameId: game.gameId}});
};

