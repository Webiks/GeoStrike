import { Component } from '@angular/core';
import { ActionType } from 'angular-cesium';
import { CharacterService } from '../../../services/character.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'me',
  templateUrl: './me.component.html',
})
export class MeComponent {
  constructor(private character: CharacterService, private utils: UtilsService) {
  }

  get notifications$() {
    const a = this.character.state$.filter(f => f !== null).map(meState => ({
      actionType: ActionType.ADD_UPDATE,
      id: meState.id,
      entity: meState,
    }));

    a.subscribe(z => {
      console.log(z);
    });

    return a;
  }
}
