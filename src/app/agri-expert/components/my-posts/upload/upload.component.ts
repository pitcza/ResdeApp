import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  postForm!: FormGroup;
  image: File | null = null;
  isSubmitting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UploadComponent>,
    private fb: FormBuilder, 
    private dataService: DataserviceService,
    private cdr: ChangeDetectorRef,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  options: string[] = [
    'Compost', 'Plastic', 'Rubber', 'Wood', 'Paper', 'Glass', 'Boxes', 
    'Mixed Waste', 'Cloth', 'Miscellaneous Products', 'Tips & Tricks', 'Issues'
  ];

  selectedOptions: string[] = [];
  dropdownOpen: boolean = false;

  get materialsFormArray() {
    return this.postForm.get('materials') as FormArray;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleOption(option: string) {
    const index = this.selectedOptions.indexOf(option);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
      this.removeMaterial(option);
    } else {
      this.selectedOptions.push(option);
      this.addMaterial(option);
    }
  }

  addMaterial(material: string) {
    this.materialsFormArray.push(this.fb.control(material));
  }

  removeMaterial(material: string) {
    const index = this.materialsFormArray.value.indexOf(material);
    if (index > -1) {
      this.materialsFormArray.removeAt(index);
    }
  }

  isSelected(option: string): boolean {
    return this.selectedOptions.includes(option);
  }

  ngOnInit() {
    this.postForm = this.fb.group({
      category: ['', Validators.required],
      materials: this.fb.array([], Validators.required),
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: [null]
    });
  }

  // Handle file selection
  onFileSelected(event: any) {
    this.image = event.target.files[0];  // Get the file
    if (this.image) {
      this.postForm.patchValue({ image: this.image });
    }
  }

  onSubmit() {
    if (this.postForm.invalid || this.isSubmitting) {
      return;
    }
  
    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('title', this.postForm.get('title')!.value);
    formData.append('category', this.postForm.get('category')!.value);
    formData.append('content', this.postForm.get('content')!.value);

    const selectedMaterials = this.materialsFormArray.value;
    selectedMaterials.forEach((material: string) => {
      formData.append('materials[]', material);
    });

    if (this.image) {
      formData.append('image', this.image);
    }

    this.dataService.createPost(formData).subscribe(
      (response) => {
        console.log('Post created successfully', response);
        this.cdr.detectChanges();
        this.closeDialog();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Your post has been successfully published.',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true
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

        // if (error?.error?.message) {
        //   errorMessage = error.error.message;
        // }
    
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