import gql from 'graphql-tag';

export const schema = gql`
  type Player {
    id: String!
    name: String!
  }
`;
