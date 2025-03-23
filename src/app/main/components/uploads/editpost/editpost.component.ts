import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.scss']
})
export class EditpostComponent implements OnInit {
  postData!: FormGroup;
  
  constructor(
    public dialogRef: MatDialogRef<EditpostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private ds: DataserviceService
  ) {}

  ngOnInit() {
    this.postData = this.fb.group({
      category: [''],
      title: [''],
      content: [''],
      materials: this.fb.array([]),
      image: ['']
    });
  
    this.fetchPost();
  }

  fetchPost() {
    console.log('Received post ID:', this.data.id); // Debugging
    if (!this.data.id) {
      console.error('Post ID is undefined!');
      return;
    }
  
    this.ds.getPost(this.data.id).subscribe((response: any) => {
      if (response) {
        this.postData.patchValue({
          category: response.category,
          title: response.title,
          content: response.content
        });
  
        // Handle existing media (image or video)
        if (response.image) {
          this.imagePreview = response.image; // Store URL
          this.isVideo = response.image.endsWith('.mp4') || response.image.includes('video');
        }
  
        // Handle materials
        this.selectedOptions = []; // Reset before populating
        const materialsArray = this.postData.get('materials') as FormArray;
        materialsArray.clear(); // Clear existing materials
  
        let materialsData = response.materials;
  
        if (typeof materialsData === 'string') {
          try {
            materialsData = JSON.parse(materialsData); // Convert string to array
          } catch (error) {
            console.error('Error parsing materials:', error);
            materialsData = [];
          }
        }
  
        if (Array.isArray(materialsData)) {
          materialsData.forEach((material: string) => {
            this.selectedOptions.push(material);
            materialsArray.push(this.fb.control(material));
          });
        }
  
        this.cdr.detectChanges();
      }
    }, (error) => {
      console.error('Error fetching post:', error);
    });
  }  
  
  selectedFile: File | null = null; // Store selected file
  imagePreview: string | ArrayBuffer | null = null; // Preview URL
  isVideo: boolean = false; // To determine if file is a video

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
  
    const maxImageSize = 6 * 1024 * 1024; // 6MB
    const maxVideoSize = 6 * 1024 * 1024; // 6MB
    const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/quicktime'];
  
    if (file.type.startsWith('image/')) {
      if (!allowedImageTypes.includes(file.type)) {
        Swal.fire({
          title: 'Invalid File Type',
          text: 'Only PNG, JPG, JPEG, and WEBP images are allowed.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#7F7F7F'
        });
        return;
      }
      if (file.size > maxImageSize) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Image file size should not exceed 5MB.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#7F7F7F'
        });
        return;
      }
    } 
    else if (file.type.startsWith('video/')) {
      if (!allowedVideoTypes.includes(file.type)) {
        Swal.fire({
          title: 'Invalid File Type',
          text: 'Only MP4 and MOV videos are allowed.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#7F7F7F'
        });
        return;
      }
      if (file.size > maxVideoSize) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Video file size should not exceed 5MB.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#7F7F7F'
        });
        return;
      }
    } 
    else {
      Swal.fire({
        title: 'Invalid File',
        text: 'Only images (PNG, JPG, JPEG, WEBP) and videos (MP4, MOV) are allowed.',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: '#7F7F7F'
      });
      return;
    }
  
    this.selectedFile = file;
    this.isVideo = file.type.startsWith('video/');
    
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;  
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

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
    return this.postData.get('materials') as FormArray;
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

  onSubmit() {
    Swal.fire({
      title: 'Update Post',
      text: 'Are you suer you want to update this post?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#266CA9',
      cancelButtonColor: '#7F7F7F',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
  
        // Append text fields
        formData.append('category', this.postData.value.category);
        formData.append('title', this.postData.value.title);
        formData.append('content', this.postData.value.content);
  
        // Append materials as an array
        this.postData.value.materials.forEach((material: string) => {
          formData.append('materials[]', material);
        });
  
        // Append new image if selected, otherwise retain the existing image
        if (this.selectedFile) {
          formData.append('image', this.selectedFile); // New image file
        } else if (this.imagePreview && typeof this.imagePreview === 'string') {
          formData.append('existingImage', this.imagePreview); // Keep existing image
        }
  
        // Call the API
        this.ds.updatePost(this.data.id, formData).subscribe(response => {
          Swal.fire('Updated!', 'Your post has been updated successfully.', 'success');
          this.closeDialog();
        }, error => {
          Swal.fire('Error', 'Failed to update post', 'error');
        });
      }
    });
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
