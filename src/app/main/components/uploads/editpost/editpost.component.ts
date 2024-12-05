import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrls: ['./editpost.component.scss']
})
export class EditpostComponent implements OnInit {
  postData: any = { title: '', content: '', category: '' }; // Default object structure
  id: string | null = null;
  ImagePreview: string | ArrayBuffer | null = null;

  constructor(
    public dialogRef: MatDialogRef<EditpostComponent>,
    private router: Router,
    private route: ActivatedRoute,
    private ds: DataserviceService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Retrieved post ID:', this.id);

    const numericId = this.id ? Number(this.id) : null;
    if (numericId !== null) {
      this.ds.getPost(numericId).subscribe(
        (data) => {
          this.postData = data;
          console.log('Fetched post data:', this.postData);
        },
        (error) => {
          console.error('Error fetching post data:', error);
        }
      );
    }
  }

  // Handles the file selection and previews the image
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.ImagePreview = reader.result as string; // Store as string
      };
      reader.readAsDataURL(file);
    }
  }

  // Confirmation before updating post
  updatePost(): void {
    if (!this.postData.title || !this.postData.content || !this.postData.category) {
      Swal.fire({
        icon: 'error',
        text: 'Please fill in all required fields.',
      });
      return;
    }
  
    // Log the post data to check
    console.log('Post data:', this.postData);
    
    Swal.fire({
      title: 'Update Post',
      text: 'Are you sure you want to update your post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#404B43',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const postId = this.id ? Number(this.id) : null;
  
        if (postId !== null) {
          const formData = new FormData();
  
          // Append text fields to formData
          formData.append('title', this.postData.title);
          formData.append('content', this.postData.content);
          formData.append('category', this.postData.category);
  
          // If there is a new image, convert it to a file and add to FormData
          if (typeof this.ImagePreview === 'string' && this.ImagePreview) {
            const file = this.dataURLToFile(this.ImagePreview, 'image.png');
            formData.append('image', file);
          }
  
          // Log FormData to check the data before sending
          console.log('FormData:', formData);
  
          // Send data to the backend
          this.ds.updatePost(postId, formData).subscribe(
            (response) => {
              Swal.fire({
                icon: 'success',
                text: 'Post has been updated.',
              });
              this.router.navigate(['main/uploads/list']);
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                text: 'Failed to update the post. Please try again.',
              });
              console.error('Error updating post:', error);
            }
          );
        } else {
          console.error('Invalid post ID');
        }
      }
    });
  }
  

  // Helper function to convert Base64 to File
  dataURLToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'; // Default MIME type
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    
    return new File([u8arr], filename, { type: mime });
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
