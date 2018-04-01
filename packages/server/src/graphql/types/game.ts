import gql from 'graphql-tag';

export const schema = gql`
    enum GameState {
        WAITING,
        ACTIVE,
        DONE,
    }

    type Game {
        id: String!
        players: [Player!]
        gameCode: String!
        state: GameState!
        me: User
        winingTeam: Team
        terrainType: String!
    }

    type CreateOrJoinResult {
        game: Game!
        player: User!
        playerToken: String!
    }
`;
