import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { CurrentGame, GameFields } from '../../../types';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AcEntity, AcNotification, ActionType } from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { EndGameDialogComponent } from '../end-game-dialog/end-game-dialog.component';
import { MdDialog } from '@angular/material';
import { CharacterService } from '../../services/character.service';
import { HowToPlayDialogComponent } from '../how-to-play-dialog/how-to-play-dialog.component';

@Component({
  selector: 'game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss']
})
export class GameContainerComponent implements OnInit, OnDestroy {
  private gameData$: Observable<GameFields.Fragment>;
  private game: CurrentGame.CurrentGame;
  private me: GameFields.Me;
  private gameDataSubscription: Subscription;
  private players$: Subject<AcNotification> = new Subject<AcNotification>();
  private killedDialogOpen = false;

  constructor(private gameService: GameService,
              private character: CharacterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private ngZone: NgZone,
              private  dialog: MdDialog) {
  }

  ngOnInit() {

    const paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.ngZone.runOutsideAngular(() => {
        if (!params.playerToken) {
          this.router.navigate(['/']);
          paramsSubscription.unsubscribe();

          return;
        }

        AuthorizationMiddleware.setToken(params.playerToken);
        this.gameService.refreshConnection();
        this.gameData$ = (this.gameService.getCurrentGameData() as Observable<any>).map(({data: {currentGame}}) => currentGame);
        this.gameDataSubscription = this.gameData$.subscribe(currentGame => {
          this.game = currentGame;
          this.me = currentGame.me;
          if (this.me) {
            this.character.syncState(this.me);
          }

          if (this.me && this.me.state === 'DEAD' && !this.killedDialogOpen) {
            this.killedDialogOpen = true;
            this.dialog.open(EndGameDialogComponent, {
              height: '30%',
              width: '60%',
              disableClose: true,
            });
          }

          this.game.players.map<AcNotification>(player => ({
            actionType: ActionType.ADD_UPDATE,
            id: player.id,
            entity: new AcEntity(player),
          })).forEach(notification => {
            this.players$.next(notification);
          });
        }, e => {
          this.router.navigate(['/']);
        });
      });
    });

  }

  openHelp(event: Event) {
    this.dialog.open(HowToPlayDialogComponent, {
      height: '75%',
      width: '85%',
      panelClass: 'container-how-to-play'
    })
  }

  ngOnDestroy() {
    if (this.gameDataSubscription) {
      this.gameDataSubscription.unsubscribe();
    }
  }
}
