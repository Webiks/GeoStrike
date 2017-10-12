import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanchedDialogComponent } from './banched-dialog.component';

describe('BanchedDialogComponent', () => {
  let component: BanchedDialogComponent;
  let fixture: ComponentFixture<BanchedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanchedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanchedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
