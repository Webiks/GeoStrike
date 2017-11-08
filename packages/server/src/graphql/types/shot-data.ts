import gql from 'graphql-tag';

export const schema = gql`
    type ShotData {
        id: String
        byPlayer: Player
        shotPosition: Location
        time: Float
    }
`;
