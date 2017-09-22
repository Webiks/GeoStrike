import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BigButtonComponent } from './big-button/big-button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BigButtonComponent],
  exports: [BigButtonComponent],
})
export class SharedModule { }
