import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthorizationMiddleware } from '../../../core/network/authorization-middleware';
import { ApolloQueryResult } from 'apollo-client';
import { JoinGame } from '../../../types';
import { ActiveGameService } from '../../services/active-game.service';
import { MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'join-game-dialog',
  templateUrl: './join-game-dialog.component.html',
  styleUrls: ['./join-game-dialog.component.scss']
})
export class JoinGameDialogComponent implements OnInit {
  private gameCode = '';
  private error = '';
  private characterName: string = null;
  private loading = false;

  constructor(private router: Router,
              private dialogRef: MdDialogRef<any>,
              private gameService: GameService,
              private activeGameService: ActiveGameService) {
  }

  ngOnInit() {
  }


  characterChanged(name) {
    this.characterName = name;
  }

  joinGame() {
    this.loading = true;
    this.error = '';

    this.gameService.joinGame(this.gameCode, this.characterName).subscribe((result: ApolloQueryResult<JoinGame.Mutation>) => {
      this.loading = result.loading;

      if (!result.loading && result.data) {
        AuthorizationMiddleware.setToken(result.data.joinGame.playerToken);
        this.activeGameService.current = result.data.joinGame.game.id;
        this.goToGame();
      }
    }, (error) => {
      this.loading = false;
      this.error = error.message;
    });
  }

  goToGame() {
    this.dialogRef.close();
    this.router.navigate(['/room']);
  }
}
