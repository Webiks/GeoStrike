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
  }

  type CreateOrJoinResult {
    game: Game!
    player: Player!
    playerToken: String!
  }
`;
