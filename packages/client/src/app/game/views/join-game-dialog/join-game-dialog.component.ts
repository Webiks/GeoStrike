import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { ApolloQueryResult } from 'apollo-client';
import { JoinGame, Team } from '../../../types';
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
  private username = '';
  private loading = false;
  private characterName: string = null;
  private team: Team = 'BLUE';

  constructor(private router: Router,
              private dialogRef: MdDialogRef<any>,
              private gameService: GameService) {
  }

  ngOnInit() {
  }


  characterChanged({ name, team }) {
    this.characterName = name;
    this.team = team;
  }

  joinGame() {
    this.loading = true;
    this.error = '';

    this.gameService.joinGame(this.gameCode, this.characterName, this.username, this.team)
      .subscribe((result: ApolloQueryResult<JoinGame.Mutation>) => {
        this.loading = result.loading;

        if (!result.loading && result.data) {
          AuthorizationMiddleware.setToken(result.data.joinGame.playerToken);
          this.goToGame();
        }
      }, (error) => {
        this.loading = false;
        this.error = error.message;
      });
  }

  goToGame() {
    this.dialogRef.close();
    this.router.navigate(['/room', AuthorizationMiddleware.token]);
  }
}
