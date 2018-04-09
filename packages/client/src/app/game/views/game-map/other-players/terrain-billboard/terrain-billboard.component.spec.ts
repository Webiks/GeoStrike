import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrainBillboardComponent } from './terrain-billboard.component';

describe('TerrainBillboardComponent', () => {
  let component: TerrainBillboardComponent;
  let fixture: ComponentFixture<TerrainBillboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerrainBillboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerrainBillboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
