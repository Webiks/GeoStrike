import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { createNewGameMutation } from '../../graphql/create-new-game.mutation';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import { CreateNewGame, JoinGame } from '../../types';
import { joinGameMutation } from '../../graphql/join-game.mutation';

@Injectable()
export class GameService {
  constructor(private apollo: Apollo) {
  }

  createNewGame(character: string): Observable<ApolloQueryResult<CreateNewGame.Mutation>> {
    return this.apollo.mutate<CreateNewGame.Mutation>({
      mutation: createNewGameMutation,
      variables: {
        character,
      },
    });
  }

  joinGame(gameCode: string, character: string): Observable<ApolloQueryResult<JoinGame.Mutation>> {
    return this.apollo.mutate<JoinGame.Mutation>({
      mutation: joinGameMutation,
      variables: {
        gameCode,
        character,
      },
    });
  }
}
