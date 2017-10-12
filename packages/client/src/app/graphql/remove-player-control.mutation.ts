import gql from 'graphql-tag';

export const removeControlMutation= gql`
  mutation removeControl($playerId: String!){
    removeControlOverPlayer(playerId: $playerId){
      id
    }
  }
`;
