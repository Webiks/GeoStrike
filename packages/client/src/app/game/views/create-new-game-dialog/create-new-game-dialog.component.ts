import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CreateNewGame, Team } from '../../../types';
import { ApolloQueryResult } from 'apollo-client';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { Router } from '@angular/router';
import { MdDialogRef } from '@angular/material';
import { VIEWER } from '../../../shared/characters.const';

@Component({
  selector: 'create-new-game-dialog',
  templateUrl: './create-new-game-dialog.component.html',
  styleUrls: ['./create-new-game-dialog.component.scss'],
})
export class CreateNewGameDialogComponent {
  private username = '';
  private loading = false;
  private gameCode: string = null;
  private characterName: string = null;
  private team: Team = 'BLUE';

  constructor(private dialogRef: MdDialogRef<any>,
              private router: Router,
              private gameService: GameService) {
  }

  characterChanged({name, team}) {
    this.characterName = name;
    this.team = team;
  }

  createGame() {
    this.loading = true;

    const isViewer = this.characterName === VIEWER.name;
    this.gameService
      .createNewGame(this.characterName, this.username, this.team, isViewer)
      .subscribe((result: ApolloQueryResult<CreateNewGame.Mutation>) => {
        this.loading = result.loading;

        if (!result.loading && result.data) {
          AuthorizationMiddleware.setToken(result.data.createNewGame.playerToken);
          this.gameCode = result.data.createNewGame.game.gameCode;
        }
      },);
  }

  goToGame() {
    this.dialogRef.close();
    this.router.navigate(['/room', AuthorizationMiddleware.token]);
  }
}
