import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { createNewGameMutation } from '../../graphql/create-new-game.mutation';
import { ApolloExecutionResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';
import {
  CreateNewGame,
  GameData,
  GameNotifications,
  JoinAsViewer,
  JoinGame,
  NotifyKill,
  Ready,
  Team,
  UpdatePosition
} from '../../types';
import { joinGameMutation } from '../../graphql/join-game.mutation';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { gameDataSubscription } from '../../graphql/game-data.subscription';
import { readyMutation } from '../../graphql/ready.mutation';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/share';
import { updatePositionMutation } from '../../graphql/update-position.mutation';
import { ApolloService } from '../../core/configured-apollo/network/apollo.service';
import { notifyKillMutation } from '../../graphql/notify-kill.mutation';
import { GameConfig } from './game-config';
import { CharacterService } from './character.service';
import { joinAsViewer } from '../../graphql/join-as-viewer.mutation';
import { gameNotificationsSubscription } from '../../graphql/game-notifications.subscription';

@Injectable()
export class GameService {
  private socket: SubscriptionClient;
  private serverPositionUpdateInterval;
  private lastStateSentToServer;

  constructor(private apollo: Apollo,
              subscriptionClientService: ApolloService,
              private character: CharacterService) {
    this.socket = subscriptionClientService.subscriptionClient;
  }

  refreshConnection(isForced = false) {
    this.socket.close(true, true);
    this.socket['connect']();

    // resolve when connected
    return new Promise(resolve => {
      this.socket.onReconnected(() => {
        console.log('reconnected');
        resolve();
      });

      this.socket.onConnected(() => {
        console.log('connected');
        resolve();
      });
    });
  }

  getCurrentGameData(): Observable<GameData.Subscription> {
    const queryRes = this.apollo.subscribe({
      query: gameDataSubscription,
    });

    return queryRes as Observable<GameData.Subscription>;
  }

  getCurrentGameNotifications(): Observable<GameNotifications.Subscription> {
    const queryRes = this.apollo.subscribe({
      query: gameNotificationsSubscription,
    });

    return queryRes as Observable<GameNotifications.Subscription>;
  }

  createNewGame(character: string, username: string, team: Team, isViewer: boolean): Observable<ApolloExecutionResult<CreateNewGame.Mutation>> {
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

  joinGame(gameCode: string, character: string, username: string, team: Team): Observable<ApolloExecutionResult<JoinGame.Mutation>> {
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

  joinAsViewer(gameCode: string, username: string): Observable<ApolloExecutionResult<JoinAsViewer.Mutation>> {
    return this.apollo.mutate<JoinAsViewer.Mutation>({
      mutation: joinAsViewer,
      variables: {
        gameCode,
        username,
      }
    });
  }

  readyToPlay(): Observable<ApolloExecutionResult<Ready.Mutation>> {
    return this.apollo.mutate<Ready.Mutation>({
      mutation: readyMutation,
    });
  }

  startServerUpdatingLoop() {
    this.serverPositionUpdateInterval =
      setInterval(() => this.updateServerOnPosition(), GameConfig.serverUpdatingInterval);
  }

  stopServerUpdatingLoop() {
    clearInterval(this.serverPositionUpdateInterval);
  }


  updateServerOnPosition(skipValidation = true) {
    const state = this.createState();
    if (!state || !this.isDifferentFromLastState(state)) {
      return;
    }

    this.lastStateSentToServer = state;
    const subscription = this.apollo.mutate<UpdatePosition.Mutation>({
      mutation: updatePositionMutation,
      variables: {...state, skipValidation},
    }).subscribe(() => subscription.unsubscribe());
  }

  createState() {
    const location = this.character.location;
    const heading = this.character.heading;
    const isCrawling = this.character.isCrawling;
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
      isCrawling,
    };
  }

  isDifferentFromLastState(state): boolean {
    if (!this.lastStateSentToServer) {
      return true;
    }
    const oldStatePosition = this.lastStateSentToServer.position;
    const oldStateHeading = this.lastStateSentToServer.heading;
    const oldStateCrawling = this.lastStateSentToServer.isCrawling;
    const newStatePosition = state.position;
    const newStateHeading = state.heading;
    const newStateCrawling = state.isCrawling;
    return (
      oldStatePosition.x !== newStatePosition.x ||
      oldStatePosition.y !== newStatePosition.y ||
      oldStatePosition.z !== newStatePosition.z ||
      oldStateHeading !== newStateHeading ||
      oldStateCrawling !== newStateCrawling
    );
  }

  notifyKill(killedPlayerId): Observable<ApolloExecutionResult<NotifyKill.Mutation>> {
    return this.apollo.mutate<NotifyKill.Mutation>({
      mutation: notifyKillMutation,
      variables: {
        playerId: killedPlayerId,
      } as NotifyKill.Variables
    });
  }
}
