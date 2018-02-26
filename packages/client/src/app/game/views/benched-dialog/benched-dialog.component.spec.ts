import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchedDialogComponent } from './benched-dialog.component';

describe('BanchedDialogComponent', () => {
  let component: BenchedDialogComponent;
  let fixture: ComponentFixture<BenchedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenchedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
