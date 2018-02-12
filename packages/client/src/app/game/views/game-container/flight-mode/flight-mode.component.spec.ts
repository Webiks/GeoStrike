import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlightModeComponent} from './flight-mode.component';

describe('FlightModeComponent', () => {
  let component: FlightModeComponent;
  let fixture: ComponentFixture<FlightModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FlightModeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
