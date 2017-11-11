import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'snack-bar-content',
  template: `<span style="margin: 0 12px" [innerHTML]="data | safeHtml"></span>`,
  styleUrls: ['./snack-bar-content.component.scss']
})
export class SnackBarContentComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }
}
