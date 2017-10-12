import gql from 'graphql-tag';

export const gameNotificationsSubscription = gql`
  subscription gameNotifications {
    gameNotifications {
      message
    }
  }
`;
