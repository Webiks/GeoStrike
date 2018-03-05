// import { IGraphQLContext } from '../../context';
// import { ESubscriptionTopics, pubsub } from '../../pubsub';
// import { CharacterType, IPlayer } from '../../../core/local-data/game-manager';
//
// export const updateFlightData = (rootValue, { playerId, isFlying }, { games, game, player }: IGraphQLContext) => {
//     if (!game || !player) {
//         return null;
//     }
//     let currentPlayer = game.playersMap.get(playerId);
//
//     const heightRes = currentPlayer.flight.maxHeight - currentPlayer.flight.minHeight;
//     const currHeight = Cesium.Cartographic.fromCartesian(currentPosition).height;
//     const steps = 6;
//     const heightStep = Math.ceil(heightRes / steps);
//     const currHeightPerctange = currHeight/flightData.maxHeight;
//
//     let currHeightLevel;
//     if(currHeightPerctange <= 0.16)
//         currHeightLevel  = 'A';
//     else if(currHeightPerctange <= 0.32)
//         currHeightLevel  = 'B';
//     else if(currHeightPerctange <= 0.48)
//         currHeightLevel  = 'C';
//     else if(currHeightPerctange <= 0.64)
//         currHeightLevel  = 'D';
//     else if(currHeightPerctange <= 0.80)
//         currHeightLevel  = 'E';
//     else if(currHeightPerctange <= 0.96)
//         currHeightLevel  = 'MAX';
//     return currHeightLevel;
//
// }
