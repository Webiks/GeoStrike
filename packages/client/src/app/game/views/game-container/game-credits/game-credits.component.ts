import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CreditsDialogComponent } from "../../credits-dialog/credits-dialog.component";
import { HttpClient } from "@angular/common/http";
import { Credit } from "./credit";
import { Observable } from "rxjs/Observable";

@Component({
  selector: 'game-credits',
  templateUrl: './game-credits.component.html',
  styleUrls: ['./game-credits.component.scss']
})
export class GameCreditsComponent implements OnInit, AfterViewInit {
  public creditsJson: Observable<Credit[]>;
  public creditsComponentsWidth: number = 0;
  public isDialogOpen: boolean = false;
  @ViewChild("creditsContainer") documentRef: ElementRef;

  @HostListener('window:resize') onResize() {
    if (this.documentRef) {
      this.creditsComponentsWidth = this.documentRef.nativeElement.clientWidth;
    }
  }

  constructor(private  dialog: MatDialog, private http: HttpClient) {
  }

  ngOnInit() {
    this.getCreditsFromJson();
  }

  ngAfterViewInit() {
    setTimeout(() => this.creditsComponentsWidth = this.documentRef.nativeElement.clientWidth);
  }

  openCredits() {
    this.isDialogOpen = true;
    let dialogRef =
      this.dialog.open(CreditsDialogComponent, {
        height: '78%',
        width: '67%',
        panelClass: 'container-credits'
      } as MatDialogConfig)

    dialogRef.afterClosed().subscribe(() => this.isDialogOpen = false);
  }

  getCreditsFromJson() {
    this.creditsJson = this.http.get<Credit[]>('assets/credits/credits.json').map(res => res);
    this.creditsJson = this.creditsJson.map(x => x.filter(y => y.level == 'main'));
  }
}
