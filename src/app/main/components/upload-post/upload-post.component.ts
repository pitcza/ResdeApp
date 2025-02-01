import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { DataserviceService } from '../../../services/dataservice.service';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-post',
  templateUrl: './upload-post.component.html',
  styleUrl: './upload-post.component.scss'
})
export class UploadPostComponent {
  postForm!: FormGroup;
  image: File | null = null;  // Allows image to be null
  isSubmitting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UploadPostComponent>,
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
    private dataService: DataserviceService,
    private cdr: ChangeDetectorRef,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.postForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: [null]  // Validation here is handled server-side, so optional in Angular
    });
  }

  // Handle file selection
  onFileSelected(event: any) {
    this.image = event.target.files[0];  // Get the file
    if (this.image) {
      this.postForm.patchValue({ image: this.image });
    }
  }

  // Handle form submission
  onSubmit() {
    if (this.postForm.invalid || this.isSubmitting) {
      return;
    }
  
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('title', this.postForm.get('title')!.value);
    formData.append('category', this.postForm.get('category')!.value);
    formData.append('content', this.postForm.get('content')!.value);
    if (this.image) {
      formData.append('image', this.image);
    }

    this.dataService.createPost(formData).subscribe(
      (response) => {
        console.log('Post created successfully', response);
        this.cdr.detectChanges();
        this.closeDialog();
        Swal.fire({
          title: "Post Pending",
          text: "Waiting for the admin approval.",
          icon: "success",
          iconColor: '#689f7a',
          confirmButtonText: 'Close',
          confirmButtonColor: "#7f7f7f",
          timer: 5000,
          scrollbarPadding: false
        });
        this.isSubmitting = false; 
      },
      (error) => {
        console.error('Error creating post', error);
    
        let errorMessage = 'Please Fill up all fields.';
    
        // Check for specific error conditions
        if (error && error.error) {
          if (error.error.missingImage) {
            errorMessage = 'The image is missing. Please upload an image.';
          } else if (error.error.missingContent) {
            errorMessage = 'A description is required.';
          } else if (error.error.missingCategory) {
            errorMessage = 'Category is required.';
          }
        }
    
        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#7f7f7f"
        });

        this.isSubmitting = false;
      }
    );
  }

  cancelPopup() {
    // Check if any of the form fields are not empty
    const categoryValue = this.postForm.get('category')?.value;
    const titleValue = this.postForm.get('title')?.value;
    const descriptionValue = this.postForm.get('content')?.value;
    const imageValue = this.image;
  
    if (categoryValue || titleValue || descriptionValue || imageValue) {
      // Show the confirmation popup only if the form has some data
      Swal.fire({
        title: 'Discard post?',
        text: 'You\'ll lose this post if you discard changes.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#C14141',
        cancelButtonColor: '#7f7f7f',
        confirmButtonText: 'Discard',
        cancelButtonText: 'Keep editing',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeDialog();
        }
      });
    } else { // close agad kasi walang laman inputs
      this.closeDialog();
    }
  }
}