import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { AuthorizationMiddleware } from '../../../core/network/authorization-middleware';
import { CurrentGame, GameFields } from '../../../types';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { AcEntity, AcNotification, ActionType } from 'angular-cesium';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss']
})
export class GameContainerComponent implements OnInit, OnDestroy {
  private gameData$: Observable<GameFields.Fragment>;
  private game: CurrentGame.CurrentGame;
  private me: GameFields.Players;
  private gameDataSubscription: Subscription;
  private players$: Subject<AcNotification> = new Subject<AcNotification>();

  constructor(private gameService: GameService, private activatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    const paramsSubscription = this.activatedRoute.params.subscribe(params => {
      if (!params.playerToken) {
        this.router.navigate(['/']);
        paramsSubscription.unsubscribe();

        return;
      }

      AuthorizationMiddleware.setToken(params.playerToken);
      this.gameService.refreshConnection();
      this.gameData$ = (this.gameService.getCurrentGameData() as Observable<any>).map(({ data: { currentGame } }) => currentGame);
      this.gameDataSubscription = this.gameData$.subscribe(currentGame => {
        this.game = currentGame;
        this.me = currentGame.players.find(p => p.isMe);

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
  }

  ngOnDestroy() {
    if (this.gameDataSubscription) {
      this.gameDataSubscription.unsubscribe();
    }
  }
}
