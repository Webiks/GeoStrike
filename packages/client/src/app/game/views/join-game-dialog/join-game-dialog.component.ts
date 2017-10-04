import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { ApolloQueryResult } from 'apollo-client';
import { Team } from '../../../types';
import { MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { VIEWER } from '../../../shared/characters.const';

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


  characterChanged({name, team}) {
    this.characterName = name;
    this.team = team;
  }


  getViewerOrPlayerJoin(): Observable<ApolloQueryResult<any>> {
    if (this.characterName === VIEWER.name) {
      return this.gameService.joinAsViewer(this.gameCode, this.username);
    } else {
      return this.gameService.joinGame(this.gameCode, this.characterName, this.username, this.team);
    }
  }

  joinGame() {
    this.loading = true;
    this.error = '';

    this.getViewerOrPlayerJoin()
      .subscribe(result => {
        this.loading = result.loading;

        if (!result.loading && result.data) {
          console.log(result.data);
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
    this.router.navigate(['/room', AuthorizationMiddleware.token]);
  }
}
