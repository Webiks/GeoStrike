import gql from 'graphql-tag';

export const schema = gql`
    type Player {
        id: String!
        username: String
        character: String!
        state: PlayerState!
        isMe: Boolean!
        currentLocation: PlayerLocation!
        team: Team!
        syncState: PlayerSyncState!
        type: CharacterType!
    }

    enum CharacterType {
        PLAYER,
        BACKGROUND_CHARACTER,
        ADMIN_OVERVIEW,
    }

    enum PlayerSyncState {
        VALID,
        INVALID,
    }

    enum Team {
        BLUE,
        RED,
        NONE,
    }

    enum PlayerState {
        WAITING,
        READY,
        ALIVE,
        IN_BUILDING,
        DEAD,
    }

    type Location {
        x: Float!
        y: Float!
        z: Float!
    }

    input LocationInput {
        x: Float!
        y: Float!
        z: Float!
    }

    type PlayerLocation {
        location: Location!
        heading: Float!
    }
`;
