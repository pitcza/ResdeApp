import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AdminDataService } from '../../../../services/admin-data.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  postForm: FormGroup;
  imageFiles: File[] = [];
  imagePreviews: string[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<CreatePostComponent>,
    private fb: FormBuilder,
    private adminService: AdminDataService
  ) {
    this.postForm = this.fb.group({
      caption: ['', [Validators.required, Validators.maxLength(255)]],
      images: [null, Validators.required]
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // Handle Image Selection with Validation and Preview
  onFileChange(event: any) {
    const files: FileList | null = event.target.files;
    if (!files || files.length === 0) {
      Swal.fire({
        title: 'No Images Selected',
        text: 'Please choose at least one image to upload.',
        icon: 'warning',
        confirmButtonColor: '#7f7f7f'
      });
      return;
    }

    let selectedFiles: File[] = Array.from(files);

    // Check for duplicate images
    selectedFiles = selectedFiles.filter((file) => {
      return !this.imageFiles.some((existingFile) => existingFile.name === file.name);
    });

    if (selectedFiles.length === 0) {
      Swal.fire({
        title: 'Duplicate Images Detected',
        text: 'You have already selected these images.',
        icon: 'warning',
        confirmButtonColor: '#7f7f7f'
      });
      return;
    }

    // Check Maximum Image Upload Limit
    if (this.imageFiles.length + selectedFiles.length > 10) {
      Swal.fire({
        title: 'Upload Limit Reached',
        text: 'You can upload a maximum of 10 images per post.',
        icon: 'warning',
        confirmButtonColor: '#7f7f7f'
      });
      return;
    }

    selectedFiles.forEach((file: File) => {
      // File Extension Validation
      const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedExtensions.includes(file.type)) {
        Swal.fire({
          title: 'Unsupported File Format',
          text: 'Only PNG, JPG, and JPEG files are allowed.',
          icon: 'error',
          confirmButtonColor: '#7f7f7f'
        });
        return;
      }

      // File Size Validation (5MB limit per file)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        Swal.fire({
          title: 'File Too Large',
          text: `The file "${file.name}" exceeds the 5MB size limit.`,
          icon: 'error',
          confirmButtonColor: '#7f7f7f'
        });
        return;
      }

      // Read and preview the image
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          this.imagePreviews.push(e.target.result);
        }
      };
      reader.readAsDataURL(file);

      this.imageFiles.push(file);
    });

    this.postForm.patchValue({ images: this.imageFiles });
    this.postForm.get('images')?.updateValueAndValidity();
  }

  validateInput(field: string) {
    const captionControl = this.postForm.get('caption');

    if (field === 'caption') {
      if (captionControl?.hasError('required')) {
        Swal.fire({
          title: 'Caption Missing',
          text: 'Please provide a caption before posting.',
          icon: 'error',
          confirmButtonColor: '#7f7f7f'
        });
      } else if (captionControl?.hasError('maxlength')) {
        Swal.fire({
          title: 'Caption Too Long',
          text: 'The caption must not exceed 255 characters.',
          icon: 'error',
          confirmButtonColor: '#7f7f7f'
        });
      }
    } else if (field === 'images' && this.postForm.get('images')?.invalid) {
      Swal.fire({
        title: 'No Images Uploaded',
        text: 'Please upload at least one image before posting.',
        icon: 'error',
        confirmButtonColor: '#7f7f7f'
      });
    }
  }

  // Remove Image
  removeImage(index: number) {
    this.imageFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    this.postForm.patchValue({ images: this.imageFiles });
  }

  // Trigger File Input
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  submitPost() {
    if (!navigator.onLine) {
      Swal.fire({
        title: 'No Internet Connection',
        text: 'You are offline. Please check your connection and try again.',
        icon: 'error',
        confirmButtonColor: '#7f7f7f'
      });
      return;
    }

    if (this.postForm.invalid) {
      this.validateInput('caption');
      this.validateInput('images');
      return;
    }

    Swal.fire({
      title: 'Confirm Your Post',
      text: 'Are you sure you want to share this post?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Post it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#266CA9',
      cancelButtonColor: '#7f7f7f'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('caption', this.postForm.value.caption);
        this.imageFiles.forEach((file) => formData.append('images[]', file));

        this.adminService.createBarangayPost(formData).subscribe(
          () => {
            Swal.fire({
              title: 'Post Successful!',
              text: 'Your post has been shared with the community.',
              icon: 'success',
              confirmButtonColor: '#266CA9'
            });
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error creating post:', error);
            Swal.fire({
              title: 'Upload Failed',
              text: 'Something went wrong. Please try again.',
              icon: 'error',
              confirmButtonColor: '#7f7f7f'
            });
          }
        );
      }
    });
  }

  cancelPost() {
    Swal.fire({
      title: 'Cancel Your Post?',
      text: 'Are you sure you want to discard this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'Keep Editing',
      confirmButtonColor: '#cc4646',
      cancelButtonColor: '#266CA9'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      }
    });
  }
}