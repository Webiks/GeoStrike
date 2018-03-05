import { TestBed, inject } from '@angular/core/testing';

import { FlightModeService } from './flight-mode.service';

describe('FlightModeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlightModeService]
    });
  });

  it('should be created', inject([FlightModeService], (service: FlightModeService) => {
    expect(service).toBeTruthy();
  }));
});
