import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  constructor(private router: Router,
    public dialogRef: MatDialogRef<UploadComponent>,
  ) {}

  // if trip lagyan hehe nakacomment sa html
  ImagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.ImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  cancelPopup() {
    // Check if any of the form fields are not empty
    // const categoryValue = this.postForm.get('category')?.value;
    // const titleValue = this.postForm.get('title')?.value;
    // const descriptionValue = this.postForm.get('content')?.value;
    // const imageValue = this.image;
  
    // if (categoryValue || titleValue || descriptionValue || imageValue) {
      // Show the confirmation popup only if the form has some data
      Swal.fire({
        title: 'Discard post?',
        text: 'You\'ll lose this post if you discard changes.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#C14141',
        cancelButtonColor: '#777777',
        confirmButtonText: 'Discard',
        cancelButtonText: 'Keep editing',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeDialog();
        }
      });
    // } else { // close agad kasi walang laman inputs
    //   this.closeDialog();
    // }
  }

  // Confirmation function
  confirmAction() {
    Swal.fire({
      title: 'Upload Post',
      text: 'Are you sure you want to upload a post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4d745a',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Upload',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeDialog(); 
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          iconColor: '#689f7a',
          title: 'Post Successfully Uploaded',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    });
  }

}

