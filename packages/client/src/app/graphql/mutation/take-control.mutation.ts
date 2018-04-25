import gql from 'graphql-tag';

export const takeControlMutation= gql`
  mutation takeControl($playerId: String!){
    takeControlOverPlayer(playerId: $playerId){
      id
    }
  }
`;
