import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CurrentGame } from '../../../types';
import { ApolloQueryObservable } from 'apollo-angular';
import { AVAILABLE_CHARACTERS } from '../character-picker/character-picker.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit, OnDestroy {
  private gameData$: ApolloQueryObservable<CurrentGame.Query>;
  private game: CurrentGame.CurrentGame;
  private gameDataSubscription: Subscription;
  private gameStarted = false;

  constructor(private activatedRoute: ActivatedRoute, private gameService: GameService, private router: Router) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.playerToken) {
        AuthorizationMiddleware.setToken(params.playerToken);
        this.gameService.refreshConnection();
        this.gameData$ = this.gameService.getCurrentGameData();
        this.gameDataSubscription = this.gameData$.subscribe(({data: {currentGame}}) => {
          this.game = currentGame;

          if (this.game && this.game.state === 'ACTIVE') {
            this.gameStarted = true;
            this.gameDataSubscription.unsubscribe();
          }
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  getPlayers() {
    const players = this.game.players.filter(p => p.type === 'PLAYER');
    const me = this.game.me['__typename'] !== 'Viewer' ? this.game.me : undefined;

    return me ? [...players, me] : [...players];
  }

  ngOnDestroy() {
    if (this.gameDataSubscription) {
      this.gameDataSubscription.unsubscribe();
    }
  }

  onCountdownDown() {
    this.startGame();
  }

  startGame() {
    this.router.navigate(['/game', AuthorizationMiddleware.token]);
  }

  getCharacter(characterName: string) {
    return AVAILABLE_CHARACTERS.find(char => char.name === characterName);
  }

  ready() {
    this.gameService.readyToPlay();
  }
}
