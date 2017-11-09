import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GunIndicatorComponent } from './gun-indicator.component';

describe('GunIndicatorComponent', () => {
  let component: GunIndicatorComponent;
  let fixture: ComponentFixture<GunIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GunIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GunIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
