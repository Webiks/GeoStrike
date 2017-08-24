import gql from 'graphql-tag';

export const schema = gql`
  type Player {
    id: String!
    username: String!
    character: String!
  }
`;
