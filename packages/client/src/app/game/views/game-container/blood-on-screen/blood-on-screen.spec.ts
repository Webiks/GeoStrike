import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BloodOnScreen} from './blood-on-screen';
import {CharacterService, ViewState} from "../../../services/character.service";
import {BuildingsService} from "../../../services/buildings.service";
import {By} from "@angular/platform-browser";


describe('PlayerBloodOnscreenEffectComponent', () => {
  let component: BloodOnScreen;
  let fixture: ComponentFixture<BloodOnScreen>;
  let characterServiceStub;
  let characterService;
  let de;
  let el;
  let showBlood = true;
  let me;

  me = {
    isShooting:true
  }

  beforeEach( () => {

    characterServiceStub = {
      viewState: ViewState.FPV,
      getViewState: function () {
        return this.viewState;
      }
    }

    TestBed.configureTestingModule({
      declarations: [BloodOnScreen],
      providers: [BuildingsService,
        {provide: CharacterService, useValue: characterServiceStub}
      ]
    })


    fixture = TestBed.createComponent(BloodOnScreen);

    component = fixture.debugElement.componentInstance;
    // component.showBlood = true;
    // component.me = {};
    // component.me.isShooting = true;




  });
  it('should show empty life DIV', () => {
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.life'));
    el = de.nativeElement;
    const content = el.textContent;
    expect(content).toBeTruthy();
  });
  // it('should return FPV viewState', () => {
  //   fixture.detectChanges();
  //   characterService = TestBed.get(CharacterService);
  //   spyOn(characterServiceStub.prototype, 'getViewState').and.returnValue(characterServiceStub.viewState);
  //   // expect(characterServiceStub.getViewState).toHaveBeenCalled();
  // });
});
