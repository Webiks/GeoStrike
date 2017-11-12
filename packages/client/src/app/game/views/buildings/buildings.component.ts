import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { AcNotification } from 'angular-cesium';
import { BuildingsService } from '../../services/buildings.service';
import { GameConfig } from '../../services/game-config';
import { CharacterService, ViewState } from '../../services/character.service';

@Component({
  selector: 'buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss']
})
export class BuildingsComponent implements OnInit {

  buildings$: Subject<AcNotification>;
  wallMaterial = GameConfig.innerBuildingColor;
  Cesium = Cesium;
  showBuildings = false;

  constructor(private buildingsService: BuildingsService, private character: CharacterService, private cd: ChangeDetectorRef) {
    buildingsService.init();
    this.buildings$ = buildingsService.getBuildings();
  }

  ngOnInit() {
    this.character.viewState$.subscribe(viewState => {
      this.showBuildings = viewState !== ViewState.OVERVIEW;
      this.cd.detectChanges();
    });
  }

}
