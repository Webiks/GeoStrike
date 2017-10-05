import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathCreatorComponent } from './path-creator.component';

describe('PathCreatorComponent', () => {
  let component: PathCreatorComponent;
  let fixture: ComponentFixture<PathCreatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathCreatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
