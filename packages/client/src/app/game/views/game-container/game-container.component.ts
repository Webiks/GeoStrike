import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { CurrentGame, GameFields, PlayerFields, Team } from '../../../types';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AcEntity, AcNotification, ActionType } from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { CharacterService, MeModelState, ViewState } from '../../services/character.service';
import { TakeControlService } from '../../services/take-control.service';
import { SnackBarContentComponent } from '../../../shared/snack-bar-content/snack-bar-content.component';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';

export class OtherPlayerEntity extends AcEntity {
}

@Component({
  selector: 'game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss'],
  providers: [TakeControlService]
})
export class GameContainerComponent implements OnInit, OnDestroy {
  isViewer: boolean;
  otherPlayers$: Subject<AcNotification> = new Subject<AcNotification>();
  allPlayers$: Subject<PlayerFields.Fragment[]> = new Subject<PlayerFields.Fragment[]>();
  gameResult$: Subject<Team> = new Subject();
  gameData$: Observable<GameFields.Fragment>;
  gameNotifications$: Observable<string>;
  me: GameFields.Me;
  gameCode: string;
  viewState: ViewState;
  private game: CurrentGame.CurrentGame;
  private gameDataSubscription: Subscription;
  private gameNotificationsSubscription: Subscription;
  private paramsSubscription: Subscription;

  constructor(private gameService: GameService,
              private character: CharacterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private ngZone: NgZone,
              public controlledService: TakeControlService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.ngZone.runOutsideAngular(() => {
        if (!params.playerToken) {
          this.router.navigate(['/']);
          this.paramsSubscription.unsubscribe();

          return;
        }

        this.ngZone.run(() => {
          this.gameCode = params.gameCode;
        });
        AuthorizationMiddleware.setToken(params.playerToken);
        this.gameService.refreshConnection();
        this.gameNotifications$ = (this.gameService.getCurrentGameNotifications()).map(notification => {
          return notification.gameNotifications.message;
        });
        this.gameData$ = (this.gameService.getCurrentGameData())
          .map(({gameData}) => gameData);
        this.gameDataSubscription = this.gameData$.subscribe(currentGame => {
          this.game = currentGame;
          this.me = currentGame.me;
          this.gameResult$.next(currentGame.winingTeam);
          const players = this.game.players.filter(p => p.state !== 'WAITING');

          const allPlayers = [...players];
          if (this.me) {
            this.isViewer = this.me.type === 'OVERVIEW' || this.me['__typename'] === 'Viewer';
            this.character.meFromServer = this.me;
            if (!this.isViewer && this.me.state !== 'CONTROLLED') {
              this.character.syncState(this.me);
              allPlayers.push(this.me);
            }

            if (this.character.initialized) {
              this.setCharacterStateFromServer();
            }
          }

          const controlledPlayer = this.controlledService.controlledPlayer;
          this.allPlayers$.next(allPlayers);
          players
            .filter(p => !controlledPlayer || controlledPlayer.id !== p.id)
            .map<AcNotification>(player => ({
              actionType: ActionType.ADD_UPDATE,
              id: player.id,
              entity: new OtherPlayerEntity({...player, name: player.character.name}),
            })).forEach(notification => {
            this.otherPlayers$.next(notification);
          });
        }, e => {
          console.log('subscription error', e);
          this.router.navigate(['/']);
        }, () => {
          console.log('subscription complete');
        });
      });
    });
  }

  private setCharacterStateFromServer() {
    if (!this.isViewer) {
      if (this.me.state === 'DEAD') {
        this.character.state = MeModelState.DEAD;
      } else if (this.me.state === 'CONTROLLED') {
        this.character.state = MeModelState.CONTROLLED;
        this.character.isInsideBuilding = false;
        // from controlled to normal state
      } else if (this.character.state === MeModelState.CONTROLLED && this.me.state === 'ALIVE') {
        this.character.state = MeModelState.WALKING;
        this.character.viewState = ViewState.OVERVIEW;
        this.character.viewState = ViewState.SEMI_FPV;
        this.otherPlayers$.next({
          id: this.me.id,
          actionType: ActionType.DELETE,
        });
      }
      if (this.character.viewState === ViewState.OVERVIEW) {
        this.otherPlayers$.next({
          id: this.me.id,
          actionType: ActionType.ADD_UPDATE,
          entity: this.me,
        });
      }

    } else {
      // if controlling set state from controlled player
      if (this.controlledService.controlledPlayer) {
        const controlledPlayer = this.game.players.find(p => p.id === this.controlledService.controlledPlayer.id);
        if (controlledPlayer && controlledPlayer.state === 'DEAD') {
          this.character.state = MeModelState.DEAD;
        }
      } else {
        this.character.state = MeModelState.WALKING;
      }
    }
  }

  ngOnDestroy() {
    if (this.gameDataSubscription) {
      this.gameDataSubscription.unsubscribe();
    }

    if (this.gameNotificationsSubscription) {
      this.gameNotificationsSubscription.unsubscribe();
    }

    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  getPlayers(team: Team): Observable<PlayerFields.Fragment[]> {
    return this.allPlayers$.map((players) => players.filter(p => p.team === team)).distinctUntilChanged((a, b) => _.isEqual(a, b));
  }

  gameStarted() {
    this.gameNotificationsSubscription = this.gameNotifications$
      .subscribe(notification => {
        this.ngZone.run(() => {
          this.snackBar.openFromComponent(SnackBarContentComponent, {
            data: notification,
            duration: 5000,
          });
        });
      });
  }

}
