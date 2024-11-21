import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';

@Component({
  selector: 'app-uploadform',
  templateUrl: './uploadform.component.html',
  styleUrl: './uploadform.component.scss'
})
export class UploadformComponent implements OnInit {
  postForm!: FormGroup;
  image: File | null = null;  // Allows image to be null

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router,
    private dataService: DataserviceService) {}

  // if trip lagyan hehe nakacomment sa html
  ImagePreview: string | ArrayBuffer | null = null;

  // onFileSelected(event: Event): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.ImagePreview = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

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
        this.router.navigate(['main/uploads/list']); 
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
    // Initialize the form with validators
    this.postForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: [null, Validators.required]  // Make sure image is required
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
      return;  // If the form is invalid, do nothing
    }
  
    const formData = new FormData();
    formData.append('title', this.postForm.get('title')!.value);
    formData.append('category', this.postForm.get('category')!.value);
    formData.append('content', this.postForm.get('content')!.value);
    if (this.image) {
      formData.append('image', this.image);  // Append the image file if selected
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
}
