import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GameCreditsComponent} from './game-credits.component';

describe('GameCreditsComponent', () => {
  let component: GameCreditsComponent;
  let fixture: ComponentFixture<GameCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameCreditsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
