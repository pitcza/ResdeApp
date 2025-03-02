import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminDataService } from '../../../../services/admin-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EditLatestComponent } from '../edit-latest/edit-latest.component';

@Component({
  selector: 'app-display-images',
  templateUrl: './display-images.component.html',
  styleUrls: ['./display-images.component.scss']
})

export class DisplayImagesComponent implements OnInit {
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;

  photoForm: FormGroup;
  selectedImages: { [key: string]: File | null } = {};
  imagePreviews: { [key: string]: string | null } = {};
  inputRows: number[] = [1]; // Start with one input row

  constructor(
    public dialogRef: MatDialogRef<DisplayImagesComponent>,
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

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  addInputRow() {
    if (this.inputRows.length < 5) {
      this.inputRows.push(this.inputRows.length + 1);
    }
  }

  removeInputRow(index: number) {
    if (this.inputRows.length > 1) {
      // Shift all remaining elements down to maintain correct mapping
      for (let i = index; i < this.inputRows.length - 1; i++) {
          const nextIndex = i + 2; // The next element in the row sequence

          // Shift images & previews
          this.selectedImages['image' + (i + 1)] = this.selectedImages['image' + nextIndex] || null;
          this.imagePreviews['image' + (i + 1)] = this.imagePreviews['image' + nextIndex] || null;

          // Shift content field values
          const currentContentKey = 'content' + (i + 1);
          const nextContentKey = 'content' + nextIndex;

          if (this.photoForm.controls[nextContentKey]) {
              this.photoForm.controls[currentContentKey].setValue(this.photoForm.controls[nextContentKey].value || '');
              this.photoForm.controls[currentContentKey].enable();
          } else {
              this.photoForm.controls[currentContentKey].setValue('');
              this.photoForm.controls[currentContentKey].disable();
          }
      }

      // Get last index before removal
      const lastIndex = this.inputRows.length;

      // Remove the last row data completely
      delete this.selectedImages['image' + lastIndex];
      delete this.imagePreviews['image' + lastIndex];

      if (this.photoForm.controls['content' + lastIndex]) {
          this.photoForm.removeControl('content' + lastIndex);
      }

      // Remove the row from the array
      this.inputRows.splice(index, 1);
    }
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

      this.photoForm.controls[contentKey].enable();
      this.photoForm.controls[contentKey].setValidators([Validators.required, Validators.maxLength(255)]);
      this.photoForm.controls[contentKey].updateValueAndValidity();
    } else {
      this.selectedImages[imageKey] = null;
      this.photoForm.controls[contentKey].setValue(null);
      this.photoForm.controls[contentKey].clearValidators();
      this.photoForm.controls[contentKey].disable();
      this.photoForm.controls[contentKey].updateValueAndValidity();
    }
  }

  clearImages() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This will remove all selected images and content you entered.',
        icon: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Yes, Clear All',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#266CA9',
        cancelButtonColor: '#7f7f7f'
    }).then((result) => {
        if (result.isConfirmed) {
            this.selectedImages = {};
            this.imagePreviews = {};
            this.photoForm.reset();
            this.inputRows = [1]; // Reset back to one input row

            // Manually reset all file input elements
            setTimeout(() => {
                const fileInputs = document.querySelectorAll('.file-field') as NodeListOf<HTMLInputElement>;
                fileInputs.forEach(input => input.value = '');
            });

            Swal.fire({
                title: 'Cleared',
                text: 'All images and content have been reset.',
                icon: 'info',
                confirmButtonText: 'OK',
                confirmButtonColor: '#266CA9'
            });
        }
    });
  }

  uploadImages() {
    const formData = new FormData();
    let missingContent = false;
    let missingImages = true; // Flag to check if no images are uploaded

    // Validate images & corresponding content
    Object.keys(this.selectedImages).forEach(key => {
        if (this.selectedImages[key]) {
            missingImages = false; // At least one image exists
            formData.append(key, this.selectedImages[key]!);

            const contentKey = key.replace('image', 'content');
            if (!this.photoForm.value[contentKey]) {
                missingContent = true;
            }
        }
    });

    // Check if no images are selected
    if (missingImages) {
        Swal.fire({
          title: 'No Photo/s Selected',
          text: 'Please upload at least one highlight entry before submitting.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#266CA9',
        }); 
        return;
    }

    // Check if content is missing for any uploaded image
    if (missingContent) {
        Swal.fire({
          title: 'Missing Content',
          text: 'Please enter a description/content for each uploaded image.',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#266CA9',
        });
        return;
    }

    // Append text field values to formData
    Object.keys(this.photoForm.value).forEach(key => {
        if (this.photoForm.value[key]) {
            formData.append(key, this.photoForm.value[key]);
        }
    });

    // Confirm before uploading
    Swal.fire({
        title: 'Confirm Upload',
        text: 'Are you sure you want to upload highlight/s?',
        icon: 'question',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Yes, Upload',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#266CA9',
        cancelButtonColor: '#7f7f7f',
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with upload
            this.as.uploadLandingPhotos(formData).subscribe(
                response => {
                    Swal.fire({
                      title: 'Highlights Uploaded',
                      text: 'You successfully customized the landing page highlights',
                      icon: 'success',
                      confirmButtonText: 'OK',
                      confirmButtonColor: '#266CA9',
                      timer: 5000
                    });
                    this.closeDialog();
                },
                error => {
                    let errorMessage = 'Something went wrong! Please try again.';

                    if (error.status === 400) {
                        errorMessage = 'Bad request. Please check your inputs.';
                    } else if (error.status === 413) {
                        errorMessage = 'Uploaded files are too large. Maximum file size is 2MB.';
                    } else if (error.status === 500) {
                        errorMessage = 'Server error. Please contact support.';
                    }

                    Swal.fire('Upload Failed', errorMessage, 'error');
                }
            );
        }
    });
  }

  editLatestUpload() {
    if (this.dialog) {
      this.dialog.open(EditLatestComponent);
      this.closeDialog();
    } else {
      console.error('Uploading form not found');
    }
  }
}
