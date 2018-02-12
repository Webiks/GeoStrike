import {IGameObject, IPlayer} from '../../../core/local-data/game-manager';
import {IGraphQLContext} from '../../context';

const resolvers = {
    Game: {
        id: (game: IGameObject) => game.gameId,
        gameCode: (game: IGameObject) => game.gameCode,
        players: (game: IGameObject, args, {player, games}: IGraphQLContext) => {
            const players = Array.from(game.playersMap.values());
            if (player) {
                if (games.isControlled(game, player.playerId)) {
                    return players;
                }
                else {
                    return players.filter((p: IPlayer) => p !== player);
                }
            }
            return players || [];
        },
        state: (game: IGameObject) => {
            const players = Array.from(game.playersMap.values());
            if (players.some(player => player.state === 'WAITING')) {
                return 'WAITING';
            }

            return 'ACTIVE';
        },
        me: (game: IGameObject, args, {player}: IGraphQLContext) => player || null,
    },
    CreateOrJoinResult: {
        game: result => result.game,
        player: result => result.player,
        playerToken: result => result.player.token,
    },
};

export default resolvers;
