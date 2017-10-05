import { Component } from '@angular/core';
import { MdDialog, MdSnackBar } from '@angular/material';
import { JoinGameDialogComponent } from '../join-game-dialog/join-game-dialog.component';
import { CreateNewGameDialogComponent } from '../create-new-game-dialog/create-new-game-dialog.component';
import { CreateNewGame, Team } from '../../../types';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { ApolloQueryResult } from 'apollo-client';
import { VIEWER } from '../../../shared/characters.const';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  username = 'Anonymous User';
  loading = false;
  characterName: string;
  team: Team = 'BLUE';
  error = '';

  constructor(private dialog: MdDialog,
              private snackBar: MdSnackBar,
              private router: Router,
              private gameService: GameService) {
  }


  openCreateGameDialog() {
    if (this.validateInput()) {
      this.dialog.open(CreateNewGameDialogComponent, {
        height: '100%',
        width: '100%',
        panelClass: 'general-dialog'
      });
    }
  }

  openJoinGameDialog() {
    this.dialog.open(JoinGameDialogComponent, {
      height: '100%',
      width: '100%',
      panelClass: 'general-dialog'
    });
  }


  characterChanged({name, team}) {
    this.characterName = name;
    this.team = team;
  }

  validateInput() {
    if (!this.characterName || !this.username) {
      this.snackBar.open('Please pick a Character and Username', 'OK', {duration: 3000});
      return false;
    }
    return true;
  }

  createGame() {
    if (!this.validateInput()) {
      return;
    }
    this.loading = true;
    const isViewer = this.characterName === VIEWER.name;
    this.gameService
      .createNewGame(this.characterName, this.username, this.team, isViewer)
      .subscribe((result: ApolloQueryResult<CreateNewGame.Mutation>) => {
        this.loading = false;

        if (!result.loading && result.data) {
          AuthorizationMiddleware.setToken(result.data.createNewGame.playerToken);
          const gameCode = result.data.createNewGame.game.gameCode;
          this.router.navigate(['/room', AuthorizationMiddleware.token, {gameCode}]);
        }
      }, error => {
        this.error = error;
        this.loading = false;
      });
  }
}
