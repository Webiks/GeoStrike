import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumButtonComponent } from './medium-button.component';

describe('MediumButtonComponent', () => {
  let component: MediumButtonComponent;
  let fixture: ComponentFixture<MediumButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediumButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediumButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
