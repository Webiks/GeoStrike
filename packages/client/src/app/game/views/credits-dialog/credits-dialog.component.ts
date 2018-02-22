import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Credit } from "../game-container/game-credits/credit";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'credits-dialog',
  templateUrl: './credits-dialog.component.html',
  styleUrls: ['./credits-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreditsDialogComponent implements OnInit {
  creditsJson: Observable<Credit[]>;

  constructor(public dialog: MatDialog, private http: HttpClient) {
  }


  ngOnInit() {
    this.getCreditsFromJson();
  }

  getCreditsFromJson() {
    this.creditsJson = this.http.get<Credit[]>('assets/credits/credits.json').map(res => res);
    this.creditsJson = this.creditsJson.map(x => x.filter(y => y.level == 'sub'));
  }
}
