import gql from 'graphql-tag';

export const schema = gql`

    interface User {
        id: String!
        username: String
    }
    
    type Player implements User {
        id: String!
        username: String
        character: CharacterData!
        state: PlayerState!
        isCrawling: Boolean!
        isMe: Boolean!
        currentLocation: PlayerLocation!
        team: Team!
        syncState: PlayerSyncState!
        type: CharacterType!
    }
    
    type CharacterData {
        name: String!
        model: String
        scale: Float
        team: Team
        imageUrl: String
        description: String
        portraitUrl: String
        iconUrl: String
    }
    
    type Viewer implements User {
        id: String!
        username: String 
    }
    

    enum CharacterType {
        PLAYER,
        BACKGROUND_CHARACTER,
        OVERVIEW,
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
