import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminDataService } from '../../../services/admin-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-images',
  templateUrl: './display-images.component.html',
  styleUrl: './display-images.component.scss'
})
export class DisplayImagesComponent {
  uploadForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    public dialogRef: MatDialogRef<DisplayImagesComponent>,
    private as: AdminDataService,
    private fb: FormBuilder
  ) {
    this.uploadForm = this.fb.group({
      images: [null]
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      const allowedExtensions = ['jpg', 'jpeg', 'png'];

      // Check for valid file types
      for (const file of files) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
          Swal.fire({
            title: "Invalid File Type",
            html: `Only JPG, JPEG, and PNG are allowed.<br> You selected: ${file.name}`,
            icon: "error",
            confirmButtonText: "Close",
            confirmButtonColor: "#7f7f7f"
          });
          (event.target as HTMLInputElement).value = ''; // Reset input
          return;
        }
      }

      // Check for exactly 5 images
      if (files.length !== 5) {  
        Swal.fire({
          title: "Invalid Selection",
          text: "You must select exactly 5 images.",
          icon: "error",
          confirmButtonText: "Close",
          confirmButtonColor: "#7f7f7f"
        });
        (event.target as HTMLInputElement).value = ''; // Reset input
        return;
      }

      this.selectedFiles = files;
    }
  }  

  uploadImages() {
    if (this.selectedFiles.length === 0) {
      Swal.fire({
        title: "No Images Selected",
        text: "Please select images to upload.",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor: "#7f7f7f"
      });
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    this.as.inputPhotos(formData).subscribe({
      next: (response: any) => { 
        console.log("Upload successful:", response);
        Swal.fire({
          title: "Upload Successful!",
          text: "Your images have been posted to landing page.",
          icon: "success",
          iconColor: '#689f7a',
          confirmButtonText: "Close",
          confirmButtonColor: "#7f7f7f",
          timer: 5000
        });
        this.closeDialog();
      },
      error: (error: any) => {
        console.error("Upload failed:", error);
        Swal.fire({
          title: "Upload Failed",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "Close",
          confirmButtonColor: "#7f7f7f"
        });
      }
    });
  }
}