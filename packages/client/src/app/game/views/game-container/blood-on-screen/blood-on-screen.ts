import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CharacterService, ViewState} from "../../../services/character.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'blood-on-screen',
  templateUrl: './blood-on-screen.html',
  styleUrls: ['./blood-on-screen.scss'],
  providers: [CharacterService]
})
export class BloodOnScreen implements OnInit, OnDestroy {
  @Input() me;
  showBlood$: Subscription;
  showBlood = false;

  constructor(private cd: ChangeDetectorRef, private character: CharacterService) {
  }

  ngOnInit() {
    this.showBlood$ = this.character.viewState$.map(viewState => viewState === ViewState.FPV).subscribe((x) => {
      this.showBlood = x;
    })
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.showBlood$.unsubscribe();
  }

}
