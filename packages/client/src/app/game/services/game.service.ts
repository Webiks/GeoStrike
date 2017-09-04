import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { createNewGameMutation } from '../../graphql/create-new-game.mutation';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { CreateNewGame, CurrentGame, JoinGame, NotifyKill, Ready, Team, UpdatePosition } from '../../types';
import { joinGameMutation } from '../../graphql/join-game.mutation';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { gameDataSubscription } from '../../graphql/game-data.subscription';
import { readyMutation } from '../../graphql/ready.mutation';
import { currentGameQuery } from '../../graphql/current-game.query';
import 'rxjs/add/operator/first';
import { updatePositionMutation } from '../../graphql/update-position.mutation';
import { Throttle } from 'lodash-decorators';
import { ApolloService } from '../../core/configured-apollo/network/apollo.service';
import { notifyKillMutation } from '../../graphql/notify-kill.mutation';
import { GameSettingsService } from './game-settings.service';

@Injectable()
export class GameService {
  private socket: SubscriptionClient;
  constructor(private apollo: Apollo,
              subscriptionClientService: ApolloService) {
    this.socket = subscriptionClientService.subscriptionClient;
  }

  refreshConnection() {
    this.socket.close(true, true);
    this.socket['connect']();
  }

  getCurrentGameData(): ApolloQueryObservable<CurrentGame.Query> {
    const queryRes = this.apollo.watchQuery<CurrentGame.Query>({
      query: currentGameQuery,
    });

    (queryRes as any).first().subscribe(() => {
      queryRes.subscribeToMore({
        document: gameDataSubscription,
        updateQuery: (prev, { subscriptionData: { data: { gameData } } }) => {
          return {
            currentGame: gameData
          };
        }
      });
    });

    return queryRes;
  }

  createNewGame(character: string, username: string, team: Team): Observable<ApolloQueryResult<CreateNewGame.Mutation>> {
    console.log(team);
    return this.apollo.mutate<CreateNewGame.Mutation>({
      mutation: createNewGameMutation,
      variables: {
        character,
        username,
        team,
      },
    });
  }

  joinGame(gameCode: string, character: string, username: string, team: Team): Observable<ApolloQueryResult<JoinGame.Mutation>> {
    return this.apollo.mutate<JoinGame.Mutation>({
      mutation: joinGameMutation,
      variables: {
        gameCode,
        character,
        username,
        team,
      },
    });
  }

  readyToPlay(): Observable<ApolloQueryResult<Ready.Mutation>> {
    return this.apollo.mutate<Ready.Mutation>({
      mutation: readyMutation,
    });
  }

  @Throttle(GameSettingsService.serverUpdateThrottle)
  updatePosition(cartesianPosition: any, heading: number): Observable<ApolloQueryResult<UpdatePosition.Mutation>> {
    return this.apollo.mutate<UpdatePosition.Mutation>({
      mutation: updatePositionMutation,
      variables: {
        position: {
          x: cartesianPosition.x,
          y: cartesianPosition.y,
          z: cartesianPosition.z,
        },
        heading,
      },
    });
  }

  notifyKill(killedPlayerId){
    return this.apollo.mutate<NotifyKill.Mutation>({
      mutation: notifyKillMutation,
      variables: {
        playerId: killedPlayerId,
      } as NotifyKill.Variables
    });
  }
}
