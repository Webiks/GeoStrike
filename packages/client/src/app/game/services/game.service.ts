import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { createNewGameMutation } from '../../graphql/create-new-game.mutation';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import {
  CreateNewGame, CurrentGame, JoinAsViewer, JoinGame, NotifyKill, Ready, Team,
  UpdatePosition
} from '../../types';
import { joinGameMutation } from '../../graphql/join-game.mutation';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { gameDataSubscription } from '../../graphql/game-data.subscription';
import { readyMutation } from '../../graphql/ready.mutation';
import { currentGameQuery } from '../../graphql/current-game.query';
import 'rxjs/add/operator/first';
import { updatePositionMutation } from '../../graphql/update-position.mutation';
import { ApolloService } from '../../core/configured-apollo/network/apollo.service';
import { notifyKillMutation } from '../../graphql/notify-kill.mutation';
import { GameSettingsService } from './game-settings.service';
import { CharacterService } from './character.service';
import { joinAsViewer } from '../../graphql/join-as-viewer.mutation';

@Injectable()
export class GameService {
  private socket: SubscriptionClient;
  private serverPositionUpdateInterval;
  private lastStateSentToServer;

  constructor(private apollo: Apollo,
              subscriptionClientService: ApolloService,
              private character: CharacterService,) {
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

  createNewGame(character: string, username: string, team: Team, isViewer: boolean): Observable<ApolloQueryResult<CreateNewGame.Mutation>> {
    return this.apollo.mutate<CreateNewGame.Mutation>({
      mutation: createNewGameMutation,
      variables: {
        character,
        username,
        team,
        isViewer
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

  joinAsViewer(gameCode:string, username: string) :Observable<ApolloQueryResult<JoinAsViewer.Mutation>>{
    return this.apollo.mutate<JoinAsViewer.Mutation>({
      mutation: joinAsViewer,
      variables: {
        gameCode,
        username,
      }
    })
  }

  readyToPlay(): Observable<ApolloQueryResult<Ready.Mutation>> {
    return this.apollo.mutate<Ready.Mutation>({
      mutation: readyMutation,
    });
  }

  startServerUpdatingLoop() {
    this.serverPositionUpdateInterval =
      setInterval(() => this.updateServerOnPosition(), GameSettingsService.serverUpdatingRate);
  }


  updateServerOnPosition() {
    const state = this.createState();
    if(!state || !this.isDifferentFromLastState(state)){
      return;
    }

    this.lastStateSentToServer = state;
    this.apollo.mutate<UpdatePosition.Mutation>({
      mutation: updatePositionMutation,
      variables: {...state},
    });
  }

  createState() {
    const location = this.character.location;
    const heading = this.character.heading;
    if (!location || !heading) {
      return;
    }

    return {
      position: {
        x: location.x,
        y: location.y,
        z: location.z,
      },
      heading,
    };
  }

  isDifferentFromLastState(state): boolean {
    if (!this.lastStateSentToServer) {
      return true;
    }
    const oldStatePosition = this.lastStateSentToServer.position;
    const oldStateHeading = this.lastStateSentToServer.heading;
    const newStatePosition = state.position;
    const newStateHeading = state.heading;
    return (
      oldStatePosition.x !== newStatePosition.x ||
      oldStatePosition.y !== newStatePosition.y ||
      oldStatePosition.z !== newStatePosition.z ||
      oldStateHeading !== newStateHeading
    );
  }

  notifyKill(killedPlayerId) {
    return this.apollo.mutate<NotifyKill.Mutation>({
      mutation: notifyKillMutation,
      variables: {
        playerId: killedPlayerId,
      } as NotifyKill.Variables
    });
  }
}
