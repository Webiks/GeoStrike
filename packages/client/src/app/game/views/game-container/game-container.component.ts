import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { CurrentGame, GameFields, PlayerFields, Team } from '../../../types';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AcEntity, AcNotification, ActionType } from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import { EndGameDialogComponent } from '../end-game-dialog/end-game-dialog.component';
import { MatDialog } from '@angular/material';
import { CharacterService, MeModelState, ViewState } from '../../services/character.service';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import { YouWinDialogComponent } from '../you-win-dialog/you-win-dialog.component';

@Component({
  selector: 'game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss'],
})
export class GameContainerComponent implements OnInit, OnDestroy {
  private gameData$: Observable<GameFields.Fragment>;
  private game: CurrentGame.CurrentGame;
  private me: GameFields.Me;
  private gameDataSubscription: Subscription;
  private otherPlayers$: Subject<AcNotification> = new Subject<AcNotification>();
  private allPlayers$: Subject<PlayerFields.Fragment[]> = new Subject<PlayerFields.Fragment[]>();
  private gameoverDialogOpen = false;
  private wonDialogOpen = false;
  private paramsSubscription: Subscription;

  constructor(private gameService: GameService,
              private character: CharacterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private ngZone: NgZone,
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
        this.gameData$ = (this.gameService.getCurrentGameData()).map(({gameData}) => gameData);
        this.gameDataSubscription = this.gameData$.subscribe(currentGame => {
          this.game = currentGame;
          this.me = currentGame.me;

          if (currentGame.winingTeam !== 'NONE' && (!this.wonDialogOpen && !this.gameoverDialogOpen)) {
            const loseTeam: Team = currentGame.winingTeam === 'RED' ? 'BLUE' : 'RED';
            if (currentGame.winingTeam === this.me.team) {
              this.openWinDialog(loseTeam);
            } else {
              // lose dialog
              this.openGameOverDialog(true, loseTeam);
            }
          }

          const allPlayers = [...this.game.players];
          if (this.me) {
            const overviewMode = this.me.type === 'OVERVIEW' || this.me['__typename'] === 'Viewer';

            if (!overviewMode) {
              this.character.syncState(this.me);
              allPlayers.push(this.me);
            }

            if (this.me.state === 'DEAD' && !this.gameoverDialogOpen) {
              this.openGameOverDialog(false);
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


  private openWinDialog(losingTeam: Team) {
    this.wonDialogOpen = true;
    this.dialog.open(YouWinDialogComponent, {
      height: '80%',
      width: '80%',
      disableClose: true,
      data: {losingTeam},
    });
  }

  private openGameOverDialog(gameOver: boolean, losingTeam?: Team) {
    this.gameoverDialogOpen = true;
    this.dialog.open(EndGameDialogComponent, {
      height: '80%',
      width: '80%',
      disableClose: true,
      data: {
        gameOver,
        losingTeam
      }
    }).afterClosed().subscribe((toOverView) => {
      if (toOverView) {
        this.character.viewState = ViewState.OVERVIEW;
      }
    });
  }

  ngOnDestroy() {
    if (this.gameDataSubscription) {
      this.gameDataSubscription.unsubscribe();
    }

    if (this.paramsSubscription){
      this.paramsSubscription.unsubscribe();
    }
  }

  getPlayers(team: Team): Observable<PlayerFields.Fragment[]> {
    return this.allPlayers$.map((players) => players.filter(p => p.team === team)).distinctUntilChanged((a, b) => _.isEqual(a, b));
  }

}
