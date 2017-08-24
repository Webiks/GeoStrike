import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {
  private gameData$: Observable<any>;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.gameService.refreshConnection();
    this.gameData$ = this.gameService.subscribeToGameData();
    this.gameData$.subscribe((r) => {
      console.log(r);
    });
  }
}
