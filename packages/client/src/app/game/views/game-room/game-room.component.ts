import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import {GameData, GameFields, PlayerFields} from '../../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthorizationMiddleware } from '../../../core/configured-apollo/network/authorization-middleware';
import { AVAILABLE_CHARACTERS } from '../../../shared/characters.const';
import * as _ from 'lodash';
import Me = GameFields.Me;

@Component({
  selector: 'game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit, OnDestroy {
  game: GameData.GameData;
  loading: boolean;
  gameStarted = false;
  players;
  gameCode;
  me: Me;
  isViewer: boolean;

  private gameDataSubscription: Subscription;
  private paramsSubscription;

  constructor(private activatedRoute: ActivatedRoute,
              private gameService: GameService,
              private router: Router,
              private ngZone: NgZone,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.loading = true;
      this.ngZone.runOutsideAngular(() => {
        if (params.playerToken) {

          this.gameCode = params.gameCode;
          AuthorizationMiddleware.setToken(params.playerToken);
          this.gameService.refreshConnection();

          this.gameDataSubscription = this.gameService.getCurrentGameData()
            .subscribe((gameDataResult) => {
                this.loading = false;
                this.game = gameDataResult.gameData;
                this.players = this.getPlayers(this.game);
                this.me = this.game.me;

                this.isViewer = this.me['__typename'] === 'Viewer';
                if (this.game && this.game.state === 'ACTIVE') {
                  this.gameStarted = true;
                  this.goToGameRoom();

                  this.gameDataSubscription.unsubscribe();
                }
                this.cd.detectChanges();

              },
              error => {
                console.log('subscription error:', error);
              });
        } else {
          this.router.navigate(['/']);
        }
      });
    });
  }

  getPlayers(game: GameData.GameData) {
    const players = game.players.filter(p => p.type === 'PLAYER');
    const me = game.me['__typename'] !== 'Viewer' ? this.game.me : undefined;

    const playerFromServer = me ? [...players, me] : [...players];

    const changed = !_.isEqual(this.players, playerFromServer);
    return changed ? playerFromServer : this.players;
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.gameDataSubscription) {
      this.gameDataSubscription.unsubscribe();
    }
  }

  goToGameRoom() {
    this.ngZone.run(() => {
      this.router.navigate(['/game', AuthorizationMiddleware.token, {gameCode: this.gameCode}]);
    });
  }

  getCharacter(characterName: string) {
    return AVAILABLE_CHARACTERS.find(char => char.name === characterName);
  }

  ready() {
    this.gameService.currentTerrainEnviorment.subscribe(terrainType => {
      console.log("terrainType:"+terrainType)});
    this.gameService.readyToPlay().subscribe();
  }

  getOpponentTeam() {
    return this.me && this.me.team === 'BLUE'? 'red' : 'blue';
  }

  getState(player: PlayerFields.Fragment) {
    return player.state === 'WAITING'? 'WAITING': 'READY';
  }
}
