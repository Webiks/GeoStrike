import { Inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { createNewGameMutation } from '../../graphql/create-new-game.mutation';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { CreateNewGame, JoinGame } from '../../types';
import { joinGameMutation } from '../../graphql/join-game.mutation';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { SUBSCRIPTIONS_SOCKET } from '../../core/network/websocket';
import { gameDataSubscription } from '../../graphql/game-data.subscription';

@Injectable()
export class GameService {
  constructor(private apollo: Apollo,
              @Inject(SUBSCRIPTIONS_SOCKET) private socket: SubscriptionClient) {
  }

  refreshConnection() {
    this.socket.close(true, true);
    this.socket['connect']();
  }

  subscribeToGameData(): Observable<any> {
    return this.apollo.subscribe({
      query: gameDataSubscription,
    });
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
}
