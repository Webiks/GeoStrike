import { Injectable } from '@angular/core';
import { PlayerFields } from '../../types';
import { Apollo } from 'apollo-angular';
import { takeControlMutation } from '../../graphql/take-control.mutation';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { removeControlMutation } from '../../graphql/remove-player-control.mutation';
import { CharacterService, ViewState } from './character.service';

@Injectable()
export class TakeControlService {
  private _selectedPlayerToControl: PlayerFields.Fragment;
  private _controlledPlayer = new BehaviorSubject<PlayerFields.Fragment>(undefined);

  constructor(private apollo: Apollo, private character: CharacterService) {
    this.controlledPlayer$.subscribe(controlledPlayer => {
      if (controlledPlayer) {
        this.character.viewState = ViewState.SEMI_FPV;
      } else if (controlledPlayer === null) {
        this.character.viewState = ViewState.OVERVIEW;
      }
    })
  }

  get controlledPlayer$() {
    return this._controlledPlayer;
  }

  set controlledPlayer(value: PlayerFields.Fragment) {
    this._controlledPlayer.next(value);
  }

  get controlledPlayer() {
    return this._controlledPlayer.getValue();
  }

  get selectedPlayerToControl(): PlayerFields.Fragment {
    return this._selectedPlayerToControl;
  }

  set selectedPlayerToControl(value: PlayerFields.Fragment) {
    this._selectedPlayerToControl = value;
  }

  controlPlayer(player: PlayerFields.Fragment) {
    const sub = this.apollo.mutate({
      mutation: takeControlMutation,
      variables: {
        playerId: player.id,
      }
    }).subscribe(() => {
      this.controlledPlayer = player;

      sub.unsubscribe();
    });
  }

  removePlayerControl() {
    const sub = this.apollo.mutate({
      mutation: removeControlMutation,
    }).subscribe(() => {
      this.controlledPlayer = null;
      this.selectedPlayerToControl = null;

      sub.unsubscribe();
    });
  }
}
