import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GunSoundComponent } from './gun-sound.component';

describe('GunSoundComponent', () => {
  let component: GunSoundComponent;
  let fixture: ComponentFixture<GunSoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GunSoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GunSoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
