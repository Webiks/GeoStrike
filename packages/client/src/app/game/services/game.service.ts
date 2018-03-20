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
  NotifyShot,
  NotifyBeenShot,
  Ready,
  Team,
  UpdatePosition, ChangeTerrainType
} from '../../types';
import { joinGameMutation } from '../../graphql/join-game.mutation';
import { SubscriptionClient } from 'subscriptions-transport-ws-temp';
import { gameDataSubscription } from '../../graphql/game-data.subscription';
import { readyMutation } from '../../graphql/ready.mutation';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/share';
import { updatePositionMutation } from '../../graphql/update-position.mutation';
import { ApolloService } from '../../core/configured-apollo/network/apollo.service';
import { notifyKillMutation } from '../../graphql/notify-kill.mutation';
import { GameConfig } from './game-config';
import { CharacterService, MeModelState } from './character.service';
import { joinAsViewer } from '../../graphql/join-as-viewer.mutation';
import { gameNotificationsSubscription } from '../../graphql/game-notifications.subscription';
import { notifyShotMutation } from '../../graphql/notify-shot.mutation';
import { notifyBeenShotMutation } from "../../graphql/notify-been-shot.mutation";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { changeTerrainTypeMutation } from "../../graphql/change-terrain-type.mutation";

@Injectable()
export class GameService {
  private socket: SubscriptionClient;
  private serverPositionUpdateInterval;
  private lastStateSentToServer;
  private terrainEnviormentSource = new BehaviorSubject<string>('URBAN');
  currentTerrainEnviorment = this.terrainEnviormentSource.asObservable();

  constructor(private apollo: Apollo,
              subscriptionClientService: ApolloService,
              private character: CharacterService) {
    this.socket = subscriptionClientService.subscriptionClient;
  }

  refreshConnection() {
    this.socket.close(true, true);
    this.socket['connect']();

    // resolve when connected
    // return new Promise(resolve => {
    //   this.socket.onReconnected(() => {
    //     console.log('reconnected');
    //     resolve();
    //   });
    //
    //   this.socket.onConnected(() => {
    //     console.log('connected');
    //     resolve();
    //   });
    // });
  }

  getCurrentGameData(): Observable<GameData.Subscription> {
    const queryRes = this.apollo.subscribe({
      query: gameDataSubscription,
    }).share();

    return queryRes as Observable<GameData.Subscription>;
  }

  getCurrentGameNotifications(): Observable<GameNotifications.Subscription> {
    const queryRes = this.apollo.subscribe({
      query: gameNotificationsSubscription,
    });

    return queryRes as Observable<GameNotifications.Subscription>;
  }

  createNewGame(character: string, username: string, team: Team, isViewer: boolean, terrainType: string): Observable<ApolloExecutionResult<CreateNewGame.Mutation>> {
    return this.apollo.mutate<CreateNewGame.Mutation>({
      mutation: createNewGameMutation,
      variables: {
        character,
        username,
        team,
        isViewer,
        terrainType
      },
    });
  }

  changeTerrainType(character: string, gameCode: string, terrainType: string): Observable<ApolloExecutionResult<ChangeTerrainType.Mutation>>{
    console.log("gameCode:"+gameCode)
    return this.apollo.mutate<ChangeTerrainType.Mutation>({
      mutation: changeTerrainTypeMutation,
      variables: {
        character,
        gameCode,
        terrainType
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
      variables: { ...state, skipValidation },
    }).subscribe(() => subscription.unsubscribe());
  }

  createState() {
    const location = this.character.location;
    const heading = this.character.heading;
    const isCrawling = this.character.isCrawling;
    const isShooting = this.character.state === MeModelState.SHOOTING;
    const enteringBuildingPosition = this.character.enteringBuildingPosition && this.character.enteringBuildingPosition.location;
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
      isShooting,
      enteringBuildingPosition,
    };
  }

  isDifferentFromLastState(state): boolean {
    if (!this.lastStateSentToServer) {
      return true;
    }
    const oldStatePosition = this.lastStateSentToServer.position;
    const oldStateHeading = this.lastStateSentToServer.heading;
    const oldStateCrawling = this.lastStateSentToServer.isCrawling;
    const oldStateShooting = this.lastStateSentToServer.isShooting;
    const oldEnteringBuildingPosition = this.lastStateSentToServer.EnteringBuildingPosition;
    const newStatePosition = state.position;
    const newStateHeading = state.heading;
    const newStateCrawling = state.isCrawling;
    const newStateShooting = state.isShooting;
    const newStateEnteringBuildingPosition = state.enteringBuildingPosition;
    return (
      oldStatePosition.x !== newStatePosition.x ||
      oldStatePosition.y !== newStatePosition.y ||
      oldStatePosition.z !== newStatePosition.z ||
      oldStateHeading !== newStateHeading ||
      oldStateCrawling !== newStateCrawling ||
      oldStateShooting !== newStateShooting ||
      oldEnteringBuildingPosition !== newStateEnteringBuildingPosition
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

  notifyBeenShot(killedPlayerId): Observable<ApolloExecutionResult<NotifyBeenShot.Mutation>> {
    return this.apollo.mutate<NotifyBeenShot.Mutation>({
      mutation: notifyBeenShotMutation,
      variables: {
        playerId: killedPlayerId,
      } as NotifyBeenShot.Variables
    });
  }

  notifyShot(byPlayerId, playerPosition: Cartesian3) {
    const sub = this.apollo.mutate<NotifyShot.Mutation>({
      mutation: notifyShotMutation,
      variables: {
        shotPosition: playerPosition,
        byPlayerId: byPlayerId,
      } as NotifyShot.Variables
    }).subscribe(() => {
      sub.unsubscribe();
    });
  }

  modifyTerrainEnviorment(terrainType: string){
    this.terrainEnviormentSource.next(terrainType);
  }
}
