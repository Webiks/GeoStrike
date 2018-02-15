import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsDialogComponent } from './credits-dialog.component';
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MediumButtonComponent } from "../../../shared/medium-button/medium-button.component";
import { MatDialog } from "@angular/material";


class MdDialogMock {
}

const dummyCredit = [
  {
    "symbol": "",
    "nameFieldOne": "Download this 3D Tiles tileset",
    "nameFieldTwo":"",
    "nameFieldThree":"",
    "urlOne" :"https://s3.amazonaws.com/cesiumjs/3DTiles/NewYorkCityGml.zip",
    "urlTwo": "",
    "urlThree": "",
    "level": "main"
  }
]

describe('CreditsDialogComponent', () => {
  let component: CreditsDialogComponent;
  let fixture: ComponentFixture<CreditsDialogComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let creditsMock;

  class fakeCredits {
    getCredits = function(){
      return dummyCredit;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditsDialogComponent, MediumButtonComponent ],
      imports: [HttpClientTestingModule],
      providers: [{provide:MatDialog, useClass:MdDialogMock}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditsDialogComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('.title'));
    el = de.nativeElement;

  });

  it('should display MORE CREDITS title', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain('MORE CREDITS');
  });
  it('test', () => {
    fixture.detectChanges();
    creditsMock = new fakeCredits();
    spyOn(creditsMock, 'getCredits').and.returnValue({
      "symbol": "",
      "nameFieldOne": "Download this 3D Tiles tileset",
      "nameFieldTwo":"",
      "nameFieldThree":"",
      "urlOne" :"https://s3.amazonaws.com/cesiumjs/3DTiles/NewYorkCityGml.zip",
      "urlTwo": "",
      "urlThree": "",
      "level": "main"
    })
  })
});
