import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  constructor(private router: Router) {}

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

  // Confirmation function
  confirmAction() {
    Swal.fire({
      title: 'Upload Post',
      text: `Are you sure you want to upload a post?`,
      icon: 'warning',
      iconColor: '#FFCE54',
      customClass: { popup: 'swal-font' },
      showCancelButton: true,
      confirmButtonColor: '#404B43',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['agri-admin/allposts/list']); 
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          iconColor: '#9EB3AA',
          title: 'Uploaded',
          text: 'Post successfully uploaded.',
          customClass: { popup: 'swal-font' },
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    });
  }

}

