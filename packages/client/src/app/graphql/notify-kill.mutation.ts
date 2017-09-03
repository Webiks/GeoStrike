import gql from "graphql-tag";
import { playerFragment } from "./player.fragment";

export const notifyKillMutation = gql`
mutation notifyKill($playerId: String!) {
    notifyKill(playerId: $playerId) {
      ...PlayerFields
    }
  }
  
  ${playerFragment}
`