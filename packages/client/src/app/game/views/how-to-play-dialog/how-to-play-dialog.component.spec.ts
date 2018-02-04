import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToPlayDialogComponent } from './how-to-play-dialog.component';

fdescribe('HowToPlayDialogComponent', () => {
  let component: HowToPlayDialogComponent;
  let fixture: ComponentFixture<HowToPlayDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToPlayDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToPlayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
