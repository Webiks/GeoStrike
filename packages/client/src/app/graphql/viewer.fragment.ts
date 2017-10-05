
import gql from 'graphql-tag';

export const viewerFields = gql`
  
  fragment ViewerFields on Viewer {
    username
    id
  }
`;
