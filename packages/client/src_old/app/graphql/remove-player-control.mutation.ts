import gql from 'graphql-tag';

export const removeControlMutation= gql`
  mutation removeControl{
    removeControlOverPlayer{
      id
    }
  }
`;
