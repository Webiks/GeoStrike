import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { ApolloQueryResult } from 'apollo-client';
import { Team } from '../../../types';
import { MdDialogRef, MdSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { VIEWER } from '../../../shared/characters.const';

@Component({
  selector: 'join-game-dialog',
  templateUrl: './join-game-dialog.component.html',
  styleUrls: ['./join-game-dialog.component.scss']
})
export class JoinGameDialogComponent implements OnInit {
  gameCode = '';
  error = '';
  username = 'Anonymous User';
  loading = false;
  characterName: string = null;
  team: Team = 'BLUE';

  constructor(private router: Router,
              private dialogRef: MdDialogRef<any>,
              private snackBar: MdSnackBar,
              private gameService: GameService) {
  }

  ngOnInit() {
  }


  characterChanged({name, team}) {
    this.characterName = name;
    this.team = team;
  }

  validate() {
    if (!this.gameCode || this.gameCode.length < 4) {
      this.snackBar.open('Please enter a valid Game Code', 'OK', {duration: 3000});
      return false;
    }
    console.log(this.username,this.characterName);
    if (!this.characterName || !this.username) {
      this.snackBar.open('Please choose a Character and Username', 'OK', {duration: 3000});
      return false;
    }
    return true;
  }


  getViewerOrPlayerJoin(): Observable<ApolloQueryResult<any>> {
    if (this.characterName === VIEWER.name) {
      return this.gameService.joinAsViewer(this.gameCode, this.username);
    } else {
      return this.gameService.joinGame(this.gameCode, this.characterName, this.username, this.team);
    }
  }

  joinGame() {
    if (!this.validate()) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.getViewerOrPlayerJoin()
      .subscribe(result => {
        this.loading = result.loading;

        if (!result.loading && result.data) {
          const token = result.data.joinAsViewer ? result.data.joinAsViewer.playerToken : result.data.joinGame.playerToken;
          AuthorizationMiddleware.setToken(token);
          this.goToGame();
        }
      }, (error) => {
        this.loading = false;
        this.error = error.message;
      });
  }

  goToGame() {
    this.dialogRef.close();
    this.router.navigate(['/room', AuthorizationMiddleware.token, {gameCode: this.gameCode}]);
  }
}
