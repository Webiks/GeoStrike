import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {GameCreditsComponent} from './game-credits.component';
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import {CreditsDialogComponent} from "../../credits-dialog/credits-dialog.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { MatDialog } from "@angular/material";


class MdDialogMock {
}
describe('GameCreditsComponent', () => {
  let component: GameCreditsComponent;
  let fixture: ComponentFixture<GameCreditsComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let creditsMock;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameCreditsComponent],
      imports: [HttpClientTestingModule],
      providers: [{provide:MatDialog, useClass:MdDialogMock}]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCreditsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should display cesium logo', () => {
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('.image-container #cesium-img'));
    el = de.nativeElement;
    expect(el).toBeTruthy();
  });
});
