import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewGameDialogComponent } from './create-new-game-dialog.component';

describe('CreateNewGameDialogComponent', () => {
  let component: CreateNewGameDialogComponent;
  let fixture: ComponentFixture<CreateNewGameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewGameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
