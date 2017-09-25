import gql from 'graphql-tag';

export const joinAsViewer = gql`
  mutation joinAsViewer($gameCode: String, $username: String){
    joinAsViewer(gameCode: $gameCode,username:$username){
      playerToken
      game
    }
  }
`;
