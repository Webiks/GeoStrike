import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndGameDialogComponent } from './end-game-dialog.component';

describe('EndGameDialogComponent', () => {
  let component: EndGameDialogComponent;
  let fixture: ComponentFixture<EndGameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndGameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
