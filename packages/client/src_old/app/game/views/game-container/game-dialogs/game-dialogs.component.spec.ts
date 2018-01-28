import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDialogsComponent } from './game-dialogs.component';

describe('GameDialogsComponent', () => {
  let component: GameDialogsComponent;
  let fixture: ComponentFixture<GameDialogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameDialogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
