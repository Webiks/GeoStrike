import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPlayersGunSoundComponent } from './other-players-gun-sound.component';

describe('OtherPlayersGunSoundComponent', () => {
  let component: OtherPlayersGunSoundComponent;
  let fixture: ComponentFixture<OtherPlayersGunSoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherPlayersGunSoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPlayersGunSoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
