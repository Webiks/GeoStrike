import gql from 'graphql-tag';

export const schema = gql`
    type ShotData {
        byPlayer: Player
        shotPosition: Location
        time: Float
    }
`;
