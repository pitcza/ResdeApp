import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrl: './terms-conditions.component.scss'
})
export class TermsConditionsComponent {
  constructor(
    public dialogRef: MatDialogRef<TermsConditionsComponent>,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
