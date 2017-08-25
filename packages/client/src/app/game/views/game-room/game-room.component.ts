import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CurrentGame } from '../../../types';
import { ApolloQueryObservable } from 'apollo-angular';
import { AVAILABLE_CHARACTERS } from '../character-picker/character-picker.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

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

  constructor(private gameService: GameService, private router: Router) {
  }

  ngOnInit() {
    this.gameService.refreshConnection();
    this.gameData$ = this.gameService.getCurrentGameData();
    this.gameDataSubscription = this.gameData$.subscribe(({ data: { currentGame }, loading }) => {
      this.game = currentGame;

      if (this.game && this.game.state === 'ACTIVE') {
        this.gameStarted = true;
        this.gameDataSubscription.unsubscribe();
      }
    });
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
    this.router.navigate(['/game', this.game.id]);
  }

  getCharacter(characterName: string) {
    return AVAILABLE_CHARACTERS.find(char => char.name === characterName);
  }

  ready() {
    this.gameService.readyToPlay();
  }
}
