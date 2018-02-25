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
    lifeState: PlayerLifeState
    lifeStatePerctange: Float
    isCrawling: Boolean!
    isShooting: Boolean!
    isMe: Boolean!
    currentLocation: PlayerLocation!
    team: Team!
    syncState: PlayerSyncState!
    type: CharacterType!
    enteringBuildingPosition: Location
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
    iconDeadUrl: String
    fixedHeight: Int
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
    DEAD,
    CONTROLLED,
  }
  
  enum PlayerLifeState {
    FULL,
    HIGH,
    MEDIUM,
    LOW,
    EMPTY
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
