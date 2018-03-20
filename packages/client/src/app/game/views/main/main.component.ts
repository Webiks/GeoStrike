import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar, MatTabChangeEvent } from '@angular/material';
import { CreateNewGame, Team } from '../../../types';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { ApolloExecutionResult, ApolloQueryResult } from 'apollo-client';
import { VIEWER } from '../../../shared/characters.const';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from "rxjs/Subscription";

enum GameTabs {
  JOIN_GAME,
  CREATE_GAME,
}

export const DEFAULT_USERNAME = 'Anonymous User';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent {
  username = DEFAULT_USERNAME;
  loading = false;
  characterName: string;
  team: Team = 'BLUE';
  error = '';
  gameCode = '';
  activeTab: GameTabs = GameTabs.CREATE_GAME;
  terrainType: string = 'URBAN';
  terrainSubsription: Subscription;

  constructor(private snackBar: MatSnackBar,
              private router: Router,
              private gameService: GameService) {
    this.gameService.currentTerrainEnviorment.subscribe(isTerrain => {
      // this.terrainType = isTerrain ? 'URBAN' : 'MOUNTAIN';
      this.terrainType = isTerrain;
    })
  }

  characterChanged({name, team}) {
    this.characterName = name;
    this.team = team;
  }

  validate(validateGamecode = false) {
    if (validateGamecode && (!this.gameCode || this.gameCode.length < 4)) {
      this.snackBar.open('Please enter a valid Game Code', 'OK', {duration: 3000});
      return false;
    }
    if (!this.characterName || !this.username) {
      this.snackBar.open('Please choose a Character and Username', 'OK', {duration: 3000});
      return false;
    }
    return true;
  }


  createGame() {
    if (!this.validate()) {
      return;
    }
    this.loading = true;
    const isViewer = this.characterName === VIEWER.name;
    this.gameService
      .createNewGame(this.characterName, this.username, this.team, isViewer, this.terrainType)
      .subscribe((result: ApolloQueryResult<CreateNewGame.Mutation>) => {
        this.loading = false;
        if (!result.loading && result.data) {
          AuthorizationMiddleware.setToken(result.data.createNewGame.playerToken);
          const gameCode = result.data.createNewGame.game.gameCode;
          this.goToGame(gameCode);
        }
      }, error => {
        this.error = error;
        this.loading = false;
      });
  }


  getViewerOrPlayerJoin(): Observable<ApolloExecutionResult<any>> {
    if (this.characterName === VIEWER.name) {
      return this.gameService.joinAsViewer(this.gameCode, this.username);
    } else {
      return this.gameService.joinGame(this.gameCode, this.characterName, this.username, this.team);
    }
  }

  joinGame() {
    if (!this.validate(true)) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.getViewerOrPlayerJoin()
      .subscribe(result => {
        this.loading = false;
        if (result.data) {
          const token = result.data.joinAsViewer ? result.data.joinAsViewer.playerToken : result.data.joinGame.playerToken;
          AuthorizationMiddleware.setToken(token);
          this.goToGame(this.gameCode);
        }
      }, (error) => {
        this.loading = false;
        this.error = error.message;
      });
  }

  private goToGame(gameCode) {
    this.router.navigate(['/room', AuthorizationMiddleware.token, {gameCode}]);
  }

  startGame() {
    if (this.activeTab === GameTabs.CREATE_GAME) {
      this.createGame();
    } else {
      this.joinGame();
    }
  }

  setActiveTab(tabChange: MatTabChangeEvent) {
    this.activeTab = tabChange.tab.textLabel === 'New game' ? GameTabs.CREATE_GAME : GameTabs.JOIN_GAME;
  }

  toggleTerrainType() {
    this.terrainType = (this.terrainType === 'URBAN') ? 'MOUNTAIN' : 'URBAN';
    this.gameService.modifyTerrainEnviorment(this.terrainType);
    // this.gameService.changeTerrainType(this.characterName, this.gameCode, this.terrainType).subscribe(x=> console.log(x));
  }
  toggleSwiss(){
    this.terrainType = 'SWISS';
    this.gameService.modifyTerrainEnviorment(this.terrainType);

  }
}
