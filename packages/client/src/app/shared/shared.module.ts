import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigButtonComponent } from './big-button/big-button.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SnackBarContentComponent } from './snack-bar-content/snack-bar-content.component';
import {MediumButtonComponent} from "./medium-button/medium-button.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BigButtonComponent, SafeHtmlPipe, SnackBarContentComponent, MediumButtonComponent],
  exports: [BigButtonComponent, SafeHtmlPipe, SnackBarContentComponent, MediumButtonComponent],
})
export class SharedModule { }
