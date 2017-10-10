import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YouWinDialogComponent } from './you-win-dialog.component';

describe('YouWinDialogComponent', () => {
  let component: YouWinDialogComponent;
  let fixture: ComponentFixture<YouWinDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YouWinDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YouWinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
