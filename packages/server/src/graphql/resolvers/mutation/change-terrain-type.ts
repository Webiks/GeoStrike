import { IGraphQLContext } from '../../context';

export const changeTerrainType = (rootValue, {character, gameCode, terrainType}, {games, game, player}: IGraphQLContext) => {
    console.log(terrainType);
    console.log("gameCode:"+gameCode);
    games.changeGameTerrainType(gameCode, terrainType);
    games.changePlayerLocation(gameCode, player.playerId, terrainType);
    return {
        game,
        player,
    };
};
