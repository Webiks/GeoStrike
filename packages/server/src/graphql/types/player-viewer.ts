import gql from 'graphql-tag';
import {FlightData, FlightSpeed} from "../../types";
import { FlightHeight } from "../../../../client/src/app/types";

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
    isFlying: Boolean
    isMoving: Boolean,
    flight: FlightData
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
  
  type FlightData {
  remainingTime: Float
  speed: FlightSpeed
  minHeight: Int
  maxHeight: Int
  heightLevel: FlightHeight
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
  
  enum FlightSpeed {
      NONE,
      MIN,
      MAX
  }
  
  enum FlightHeight {
    NONE,
    A,
    B,
    C,
    D,
    E,
    MAX
  }
`;
