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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  isImagePopupVisible = false;
  selectedImage: string | null = null;

  // Function to open the image in full size
  openImagePopup(imageUrl: string) {
    this.isImagePopupVisible = true;
    this.selectedImage = imageUrl;
  }

  // Function to close the image popup
  closeImagePopup() {
    this.isImagePopupVisible = false;
    this.selectedImage = null;
  }
}
