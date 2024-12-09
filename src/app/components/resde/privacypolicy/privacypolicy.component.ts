import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrl: './privacypolicy.component.scss'
})
export class PrivacypolicyComponent {
  constructor(
    public dialogRef: MatDialogRef<PrivacypolicyComponent>,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
