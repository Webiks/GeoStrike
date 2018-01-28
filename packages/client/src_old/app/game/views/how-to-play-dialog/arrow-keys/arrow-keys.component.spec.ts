import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowKeysComponent } from './arrow-keys.component';

describe('ArrowKeysComponent', () => {
  let component: ArrowKeysComponent;
  let fixture: ComponentFixture<ArrowKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrowKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrowKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
