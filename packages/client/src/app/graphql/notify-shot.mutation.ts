import gql from 'graphql-tag';

export const notifyShotMutation = gql`
  mutation notifyShot($byPlayerId: String!, $shotPosition: LocationInput!) {
    notifyShot(byPlayerId: $byPlayerId, shotPosition: $shotPosition)
  }
`;
