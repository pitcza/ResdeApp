import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-announcem',
  templateUrl: './view-announcem.component.html',
  styleUrl: './view-announcem.component.scss'
})
export class ViewAnnouncemComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewAnnouncemComponent>,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
