import { Component } from '@angular/core';
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
      Swal.fire('Warning', 'No images selected.', 'warning');
      return;
    }
  
    let selectedFiles: File[] = Array.from(files); // ✅ Explicitly convert FileList to File[]
  
    // ✅ Check if selected images exceed the limit
    if (this.imageFiles.length + selectedFiles.length > 10) {
      Swal.fire('Warning', 'You can upload a maximum of 10 images.', 'warning');
      return;
    }
  
    selectedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          this.imagePreviews.push(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    });
  
    this.imageFiles = [...this.imageFiles, ...selectedFiles]; // ✅ Ensure correct type assignment
  
    this.postForm.patchValue({ images: this.imageFiles });
    this.postForm.get('images')?.updateValueAndValidity();
  }
  

  validateInput(field: string) {
    if (this.postForm.get(field)?.invalid) {
      if (field === 'caption') {
        Swal.fire('Error', 'Caption is required and must be less than 255 characters.', 'error');
      } else if (field === 'images') {
        Swal.fire('Error', 'At least one image must be uploaded.', 'error');
      }
    }
  }

  submitPost() {
    if (this.postForm.invalid) {
      this.validateInput('caption');
      this.validateInput('images');
      return;
    }

    Swal.fire({
      title: 'Confirm Post',
      text: 'Are you sure you want to post this?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Post it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('caption', this.postForm.value.caption);
        this.imageFiles.forEach((file) => formData.append('images[]', file));

        this.adminService.createBarangayPost(formData).subscribe(
          () => {
            Swal.fire('Success', 'Post has been successfully uploaded!', 'success');
            this.dialogRef.close(true);
          },
          (error) => {
            console.error('Error creating post:', error);
            Swal.fire('Error', 'Something went wrong. Try again!', 'error');
          }
        );
      }
    });
  }

  cancelPost() {
    Swal.fire({
      title: 'Cancel Post',
      text: 'Are you sure you want to cancel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'Keep Editing'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      }
    });
  }
}
