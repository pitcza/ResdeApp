import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminDataService } from '../../../../services/admin-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-images',
  templateUrl: './display-images.component.html',
  styleUrls: ['./display-images.component.scss']
})
export class DisplayImagesComponent {
  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  selectedImages: string[] = []; // To store selected image previews
  latestImages: string[] = []; // Store latest uploaded images
  latestEntryId: number | null = null;
  latestUploadDate: string | null = null;

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

      // Reset previous selections
      this.selectedFiles = [];
      this.selectedImages = [];

      // Validate file type
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

      // Ensure exactly 5 images are selected
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
      this.selectedImages = files.map(file => URL.createObjectURL(file)); // Generate image previews
    }
  }

  fetchLatestImages(): void {
    this.as.getAllLandingPhotos().subscribe(
      (data: any[]) => {
        if (data.length > 0) {
          // Sort by newest first
          data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
          const latestEntry = data[0]; // Get the most recent entry
  
          if (latestEntry.images.length > 0) {
            this.latestImages = latestEntry.images; // Store latest images for preview
            this.latestEntryId = latestEntry.id; // Store latest entry ID for deletion
            
            // Format date as Medium Date & Short Time
          const uploadDate = new Date(latestEntry.created_at);
          this.latestUploadDate = `${uploadDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at
                                   ${uploadDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
          }
        }
      },
      (error) => {
        console.error('Error fetching latest images:', error);
      }
    );
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

    Swal.fire({
      title: "Confirm Upload",
      text: `Are you sure you want to upload these images for the landing page?`,
      icon: "warning",
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Yes, Upload",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#689f7a",
      cancelButtonColor: "#7f7f7f"
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        this.selectedFiles.forEach((file) => {
          formData.append('images[]', file);
        });

        this.as.inputPhotos(formData).subscribe({
          next: (response: any) => { 
            console.log("Upload successful:", response);
            Swal.fire({
              title: "Upload Successful!",
              text: "Your images have been posted to the landing page.",
              icon: "success",
              iconColor: '#689f7a',
              confirmButtonText: "Close",
              confirmButtonColor: "#7f7f7f",
              timer: 5000
            });

            this.closeDialog();

            // Clear selected images after upload
            this.selectedImages = [];
            this.selectedFiles = [];

            this.fetchLatestImages(); // Refresh latest images
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
    });
  }


  deleteLatestImages(): void {
    if (this.latestEntryId === null) {
      Swal.fire({
        title: "No Entry Found",
        text: "There is no latest image to delete.",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor: "#7f7f7f"
      });
      return;
    }

    // Show confirmation dialog before deletion
    Swal.fire({
      title: "Delete Images",
      text: "Are you sure you want to delete the latest images?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7f7f7f"
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.deletePhotoById(this.latestEntryId!).subscribe(
          () => {
            console.log("Latest photo entry deleted successfully");

            Swal.fire({
              title: "Deleted!",
              text: "The latest images has been successfully deleted.",
              icon: "success",
              confirmButtonText: "Close",
              confirmButtonColor: "#7f7f7f",
              timer: 4000
            });

            // Clear latest images from the UI
            this.latestImages = [];
            this.latestEntryId = null;
          },
          (error) => {
            console.error("Error deleting latest photo entry:", error);
            Swal.fire({
              title: "Deletion Failed",
              text: "Something went wrong. Please try again.",
              icon: "error",
              confirmButtonText: "Close",
              confirmButtonColor: "#7f7f7f"
            });
          }
        );
      }
    });
  }

  ngOnInit(): void {
    this.fetchLatestImages();
  }
}