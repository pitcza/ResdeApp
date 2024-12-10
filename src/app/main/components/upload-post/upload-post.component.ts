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

  // Confirmation function
  confirmAction() {
    Swal.fire({
      title: 'Upload Post',
      text: `Are you sure you want to upload a post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#404B43',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['../../uploads/list']); 
        this.cdr.detectChanges();
        Swal.fire({
          title: "Post Pending",
          text: "Waiting for the admin approval.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          timer: 5000,
          scrollbarPadding: false
        });
      }
    });
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
    if (this.postForm.invalid) {
      return;
    }
  
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
        Swal.fire({
          title: "Post Pending",
          text: "Waiting for the admin approval.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          timer: 5000,
          scrollbarPadding: false
        });
      },
      (error) => {
        console.error('Error creating post', error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while creating the post.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777"
        });
      }
    );
  }

  cancelPopup() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to discard your changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4d745a',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes, close it!',
      cancelButtonText: 'No, keep editing',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeDialog();
      }
    });
  }
}