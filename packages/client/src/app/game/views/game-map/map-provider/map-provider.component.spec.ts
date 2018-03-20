import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProviderComponent } from './map-provider.component';

describe('MapProviderComponent', () => {
  let component: MapProviderComponent;
  let fixture: ComponentFixture<MapProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
