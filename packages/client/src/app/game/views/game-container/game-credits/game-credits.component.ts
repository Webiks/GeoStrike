import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {CreditsDialogComponent} from "../../credits-dialog/credits-dialog.component";

@Component({
  selector: 'game-credits',
  templateUrl: './game-credits.component.html',
  styleUrls: ['./game-credits.component.scss']
})
export class GameCreditsComponent implements AfterViewInit {
  private creditsComponentsWidth: number = 0;
  private isDialogOpen:boolean = false;
  @ViewChild("creditsContainer") documentRef: ElementRef;

  @HostListener('window:resize') onResize() {
    if (this.documentRef) {
      this.creditsComponentsWidth = this.documentRef.nativeElement.clientWidth;
    }
  }

  constructor(private  dialog: MatDialog) {
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

    dialogRef.afterClosed().subscribe(()=> this.isDialogOpen = false);
  }
}
