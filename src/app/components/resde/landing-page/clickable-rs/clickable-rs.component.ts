import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-clickable-rs',
  templateUrl: './clickable-rs.component.html',
  styleUrls: ['./clickable-rs.component.scss']
})
export class ClickableRsComponent {
  type: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { type: string },
    private dialogRef: MatDialogRef<ClickableRsComponent>  // Inject MatDialogRef to close the dialog
  ) {
    this.type = data.type;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}