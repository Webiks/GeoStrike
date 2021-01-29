import gql from 'graphql-tag';

export const schema = gql`
    type BeenShotData {
        id: String
        lifeState: String
    }
`;
