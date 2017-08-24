import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CurrentGame } from '../../../types';
import { ApolloQueryObservable } from 'apollo-angular';
import { AVAILABLE_CHARACTERS } from '../character-picker/character-picker.component';

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  private gameData$: ApolloQueryObservable<CurrentGame.Query>;
  private game: CurrentGame.CurrentGame;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.gameService.refreshConnection();
    this.gameData$ = this.gameService.getCurrentGameData();
    this.gameData$.subscribe(({ data: { currentGame }, loading }) => {
      this.game = currentGame;
    });
  }

  getCharacter(characterName: string) {
    return AVAILABLE_CHARACTERS.find(char => char.name === characterName);
  }

  ready() {
    this.gameService.readyToPlay();
  }
}
