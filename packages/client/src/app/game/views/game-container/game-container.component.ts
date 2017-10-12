import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { CurrentGame, GameFields, PlayerFields, Team } from '../../../types';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AcEntity, AcNotification, ActionType } from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CharacterService, MeModelState } from '../../services/character.service';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import { SnackBarContentComponent } from '../../../shared/snack-bar-content/snack-bar-content.component';

@Component({
  selector: 'game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss'],
})
export class GameContainerComponent implements OnInit, OnDestroy {
  public gameData$: Observable<GameFields.Fragment>;
  public gameNotifications$: Observable<string>;
  private game: CurrentGame.CurrentGame;
  private me: GameFields.Me;
  private gameDataSubscription: Subscription;
  private gameNotificationsSubscription: Subscription;
  private otherPlayers$: Subject<AcNotification> = new Subject<AcNotification>();
  private allPlayers$: Subject<PlayerFields.Fragment[]> = new Subject<PlayerFields.Fragment[]>();
  private gameResult$: Subject<Team> = new Subject();
  private paramsSubscription: Subscription;


  constructor(private gameService: GameService,
              private character: CharacterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private ngZone: NgZone,
              private snackBar: MatSnackBar,
              private  dialog: MatDialog) {
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.ngZone.runOutsideAngular(() => {
        if (!params.playerToken) {
          this.router.navigate(['/']);
          this.paramsSubscription.unsubscribe();

          return;
        }

        AuthorizationMiddleware.setToken(params.playerToken);
        this.gameService.refreshConnection();
        this.gameData$ = (this.gameService.getCurrentGameData()).map(({ gameData }) => gameData);
        this.gameNotifications$ = (this.gameService.getCurrentGameNotifications()).map(notification => {
          return notification.gameNotifications.message;
        });
        this.gameDataSubscription = this.gameData$.subscribe(currentGame => {
          this.game = currentGame;
          this.me = currentGame.me;
          this.gameResult$.next(currentGame.winingTeam);

          const allPlayers = [...this.game.players];
          if (this.me) {
            const overviewMode = this.me.type === 'OVERVIEW' || this.me['__typename'] === 'Viewer';

            if (!overviewMode) {
              this.character.syncState(this.me);
              allPlayers.push(this.me);
            }

            if (this.me.state === 'DEAD') {
              if (this.character.initialized) {
                this.character.state = MeModelState.DEAD;
              }
            }
          }

          this.allPlayers$.next(allPlayers);
          this.game.players.map<AcNotification>(player => ({
            actionType: ActionType.ADD_UPDATE,
            id: player.id,
            entity: new AcEntity(player),
          })).forEach(notification => {
            this.otherPlayers$.next(notification);
          });
        }, e => {
          this.router.navigate(['/']);
        });
      });
    });
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
