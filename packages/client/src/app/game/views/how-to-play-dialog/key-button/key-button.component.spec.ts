import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyButtonComponent } from './key-button.component';

describe('KeyButtonComponent', () => {
  let component: KeyButtonComponent;
  let fixture: ComponentFixture<KeyButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeyButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
