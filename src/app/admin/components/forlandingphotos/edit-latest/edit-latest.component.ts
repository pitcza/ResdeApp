import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminDataService } from '../../../../services/admin-data.service';
import Swal from 'sweetalert2';
import { DisplayImagesComponent } from '../display-images/display-images.component';

@Component({
  selector: 'app-edit-latest',
  templateUrl: './edit-latest.component.html',
  styleUrl: './edit-latest.component.scss'
})
export class EditLatestComponent implements OnInit {
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  photoForm: FormGroup;
  selectedImages: { [key: string]: File | null } = {};
  imagePreviews: { [key: string]: string | null } = {};
  inputRows: number[] = [1, 2, 3, 4, 5]; // Five images allowed
  initialData: { [key: string]: string | null } = {};

  loading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<EditLatestComponent>,
    private as: AdminDataService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.photoForm = this.fb.group({
      content1: [null, Validators.maxLength(255)],
      content2: [null, Validators.maxLength(255)],
      content3: [null, Validators.maxLength(255)],
      content4: [null, Validators.maxLength(255)],
      content5: [null, Validators.maxLength(255)]
    });
  }

  ngOnInit(): void {
    this.fetchLatestPhotos();
  }

  hasPhotos: boolean = false;
  latestPhotoId: number | null = null;

  fetchLatestPhotos() {
    this.loading = true;
    this.as.getLandingPhotos().subscribe(
      (response: any) => {
        this.loading = false;
  
        // Ensure response.data exists and is not empty
        if (response.data && Object.values(response.data).some(val => val)) {
          this.hasPhotos = true;
          this.latestPhotoId = response.data.id ?? null;
  
          for (let i = 1; i <= 5; i++) {
            const imageKey = `image${i}`;
            const contentKey = `content${i}`;
  
            if (response.data[imageKey]) {
              this.imagePreviews[imageKey] = response.data[imageKey];
              this.initialData[imageKey] = response.data[imageKey];
            }
  
            if (response.data[contentKey]) {
              this.photoForm.controls[contentKey].setValue(response.data[contentKey]);
              this.initialData[contentKey] = response.data[contentKey];
            }
          }
        } else {
          this.hasPhotos = false;
          this.latestPhotoId = null;
        }
      },
      (error) => {
        this.loading = false;
        console.error("Error fetching latest photos:", error);
  
        // Only show an error if it's a real issue (e.g., server error)
        if (error.status !== 200) {
          Swal.fire('Error', 'Failed to load existing photos.', 'error');
        }
      }
    );
  }
  


  onFileSelected(event: any, imageKey: string, contentKey: string) {
    const file: File = event.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          title: 'Invalid File',
          text: 'Only JPG, JPEG, and PNG files are allowed.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#266CA9',
          timer: 5000
        });
        event.target.value = '';
        return;
      }

      if (file.size > 2048 * 1024) {
        Swal.fire({
          title: 'File Too Large',
          text: 'The file size must be less than 2MB.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#266CA9',
          timer: 5000
        });
        event.target.value = '';
        return;
      }

      this.selectedImages[imageKey] = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews[imageKey] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateLatestPhotos() {
    const formData = new FormData();
    let hasChanges = false;

    for (let i = 1; i <= 5; i++) {
      const imageKey = `image${i}`;
      const contentKey = `content${i}`;

      if (this.selectedImages[imageKey]) {
        formData.append(imageKey, this.selectedImages[imageKey]!);
        hasChanges = true;
      }

      if (this.photoForm.value[contentKey]) {
        formData.append(contentKey, this.photoForm.value[contentKey]);
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      Swal.fire('No Changes', 'You have not made any changes.', 'info');
      return;
    }

    Swal.fire({
      title: 'Confirm Update',
      text: 'Are you sure you want to update the landing page photos and content?',
      icon: 'question',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#266CA9',
      cancelButtonColor: '#7f7f7f'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with update
        this.as.editLatestPhoto(formData).subscribe(
          (response) => {
            Swal.fire({
              title: 'Updated',
              text: 'The landing page photos have been updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#266CA9',
              timer: 5000
            });
            this.closeDialog();
          },
          (error) => {
            Swal.fire('Error', 'Failed to update photos. Please try again.', 'error');
          }
        );
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  cancelEdit() {
    let hasChanges = false;

    for (let i = 1; i <= 5; i++) {
      const imageKey = `image${i}`;
      const contentKey = `content${i}`;

      // Check if images are changed
      if (this.selectedImages[imageKey]) {
        hasChanges = true;
        break;
      }

      // Check if content is changed
      if (this.photoForm.value[contentKey] !== this.initialData[contentKey]) {
        hasChanges = true;
        break;
      }
    }

    if (hasChanges) {
      Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to cancel?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Discard Changes',
        cancelButtonText: 'Go Back',
        confirmButtonColor: '#cc4646',
        cancelButtonColor: '#7f7f7f'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Changes not saved.',
            showConfirmButton: false,
            timer: 3000
          });
          this.dialogRef.close();
        }
      });
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'No changes made',
        showConfirmButton: false,
        timer: 3000
      });
      this.dialogRef.close();
    }
  }  

  uploadHighlight() {
    if (this.dialog) {
      this.dialog.open(DisplayImagesComponent);
      this.closeDialog();
    } else {
      console.error('Uploading form not found');
    }
  }

  deleteHighlight() {
    if (this.latestPhotoId === null) {
      Swal.fire({
        title: "Error",
        text: "No photo entry found to delete.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33"
      });
      return;
    }
  
    Swal.fire({
      title: "Delete Current Highlight",
      text: "Are you sure you want to delete this highlight? Your lastest upload will display to your Landing Page Highlight.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#cc4646",
      cancelButtonColor: "#7f7f7f"
    }).then((result) => {
      if (result.isConfirmed && this.latestPhotoId !== null) {
        this.as.deletePhotoById(this.latestPhotoId!).subscribe(
          (response) => {
            Swal.fire({
              title: "Highlight Deleted",
              text: "Your latest uploaded displayed to your Landing Page Highlight.",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#266CA9",
              timer: 5000
            });
  
            this.fetchLatestPhotos();
            this.hasPhotos = false; // Hide form after deletion
            this.latestPhotoId = null; // Reset latestPhotoId
          },
          (error) => {
            Swal.fire({
              title: "Error",
              text: error.error.message || "Something went wrong!",
              icon: "error",
              confirmButtonText: "OK",
              confirmButtonColor: "#d33"
            });
          }
        );
      }
    });
  }
  
  
}