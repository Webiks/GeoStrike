import gql from 'graphql-tag';
import {messageAdded} from "../resolvers/subscriptions/flight";

export const schema = gql`
    type Subscription {
        gameData: Game
        gameNotifications: Notification
        gunShot: ShotData
        messageAdded: [Flight]
    }
`;
