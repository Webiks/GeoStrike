import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { GameData } from '../../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { AVAILABLE_CHARACTERS } from '../../../shared/characters.const';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit, OnDestroy {
  private gameData$: Observable<GameData.GameData>;
  private game: GameData.GameData;
  private gameDataSubscription: Subscription;
  private gameStarted = false;
  private gameCode;
  private players;
  private paramsSubscription;

  constructor(private activatedRoute: ActivatedRoute,
              private gameService: GameService,
              private router: Router,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.ngZone.runOutsideAngular(() => {
        if (params.playerToken) {

          this.gameCode = params.gameCode;
          AuthorizationMiddleware.setToken(params.playerToken);
          this.gameService.refreshConnection().then(()=>{
            // this.gameData$ =
            //   .map(({gameData}) => gameData);
            this.gameDataSubscription = this.gameService.getCurrentGameData()
              .subscribe((gameDataResult) => {
                  console.log(gameDataResult);
                  this.game = gameDataResult.gameData;
                  this.players = this.getPlayers(this.game);

                  if (this.game && this.game.state === 'ACTIVE') {
                    this.gameStarted = true;
                    this.startGame();

                    this.gameDataSubscription.unsubscribe();
                  }
                  this.cd.detectChanges();

                },
                error => {
                  console.log('subscription error:', error);
                });
          });

        } else {
          this.router.navigate(['/']);
        }
      });
    });
  }

  getPlayers(game: GameData.GameData) {
    const players = game.players.filter(p => p.type === 'PLAYER');
    const me = game.me['__typename'] !== 'Viewer' ? this.game.me : undefined;

    const playerFromServer = me ? [...players, me] : [...players];

    const changed = !_.isEqual(this.players, playerFromServer);
    return changed ? playerFromServer : this.players;
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.gameDataSubscription) {
      this.gameDataSubscription.unsubscribe();
    }
  }

  startGame() {
    this.ngZone.run(() => {
      this.router.navigate(['/game', AuthorizationMiddleware.token]);
    });
  }

  getCharacter(characterName: string) {
    return AVAILABLE_CHARACTERS.find(char => char.name === characterName);
  }

  ready() {
    this.gameService.readyToPlay().subscribe();
  }
}
