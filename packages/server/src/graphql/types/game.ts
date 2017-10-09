import gql from 'graphql-tag';

export const schema = gql`
    enum GameState {
        WAITING,
        ACTIVE,
        DONE,
    }
    enum GameResult {
        RED_WON,
        BlUE_WON,
        NONE,
    }

    type Game {
        id: String!
        players: [Player!]
        gameCode: String!
        state: GameState!
        me: User
        gameResult: GameResult
    }

    type CreateOrJoinResult {
        game: Game!
        player: User!
        playerToken: String!
    }
`;
