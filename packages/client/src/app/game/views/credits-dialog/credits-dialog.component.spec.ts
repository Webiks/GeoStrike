import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsDialogComponent } from './credits-dialog.component';

describe('CreditsDialogComponent', () => {
  let component: CreditsDialogComponent;
  let fixture: ComponentFixture<CreditsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
