import { Inject, Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { createNewGameMutation } from '../../graphql/create-new-game.mutation';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { CreateNewGame, CurrentGame, JoinGame, Ready } from '../../types';
import { joinGameMutation } from '../../graphql/join-game.mutation';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { SUBSCRIPTIONS_SOCKET } from '../../core/network/websocket';
import { gameDataSubscription } from '../../graphql/game-data.subscription';
import { readyMutation } from '../../graphql/ready.mutation';
import { currentGameQuery } from '../../graphql/current-game.query';
import { AuthorizationMiddleware } from '../../core/network/authorization-middleware';
import 'rxjs/add/operator/first';

@Injectable()
export class GameService {
  constructor(private apollo: Apollo,
              @Inject(SUBSCRIPTIONS_SOCKET) private socket: SubscriptionClient) {
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

  createNewGame(character: string, username: string): Observable<ApolloQueryResult<CreateNewGame.Mutation>> {
    return this.apollo.mutate<CreateNewGame.Mutation>({
      mutation: createNewGameMutation,
      variables: {
        character,
        username,
      },
    });
  }

  joinGame(gameCode: string, character: string, username: string): Observable<ApolloQueryResult<JoinGame.Mutation>> {
    return this.apollo.mutate<JoinGame.Mutation>({
      mutation: joinGameMutation,
      variables: {
        gameCode,
        character,
        username,
      },
    });
  }

  readyToPlay(): Observable<ApolloQueryResult<Ready.Mutation>> {
    return this.apollo.mutate<Ready.Mutation>({
      mutation: readyMutation,
    });
  }
}
