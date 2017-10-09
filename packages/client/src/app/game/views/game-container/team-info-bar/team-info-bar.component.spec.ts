import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamInfoBarComponent } from './team-info-bar.component';

describe('TeamInfoBarComponent', () => {
  let component: TeamInfoBarComponent;
  let fixture: ComponentFixture<TeamInfoBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamInfoBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamInfoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
