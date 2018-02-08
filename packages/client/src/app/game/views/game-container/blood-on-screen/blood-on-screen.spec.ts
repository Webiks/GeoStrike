import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodOnScreen } from './blood-on-screen';

describe('PlayerBloodOnscreenEffectComponent', () => {
  let component: BloodOnScreen;
  let fixture: ComponentFixture<BloodOnScreen>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodOnScreen ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodOnScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
