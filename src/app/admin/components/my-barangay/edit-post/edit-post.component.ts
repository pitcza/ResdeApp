import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminDataService } from '../../../../services/admin-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  postForm!: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  existingImages: string[] = [];
  removedImages: string[] = [];
  postId!: number;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditPostComponent>,
    private adminService: AdminDataService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (!this.data || !this.data.post || !this.data.post.id) {
      console.error("❌ Post ID is missing or invalid.");
      this.dialogRef.close();
      return;
    }
  
    this.postId = this.data.post.id;
    console.log("✅ Post ID:", this.postId);
  
    this.postForm = this.fb.group({
      caption: [this.data.post.caption || ''],
      images: [[]]
    });
  
    this.loadPostData();
  }

  loadPostData(): void {
    this.adminService.getBarangayPostById(this.postId).subscribe(
      (post) => {
        this.postForm.patchValue({ caption: post.caption });
  
        // ✅ Ensure images are properly parsed into an array
        if (post.images && typeof post.images === 'string') {
          try {
            this.imagePreviews = JSON.parse(post.images);
          } catch (error) {
            console.error("Error parsing images:", error);
            this.imagePreviews = [];
          }
        } else {
          this.imagePreviews = post.images || [];
        }
      },
      (error) => console.error('Error loading post:', error)
    );
  }
  

  triggerFileInput(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';

    fileInput.onchange = (event: any) => this.onFileChange(event);
    fileInput.click();
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        this.selectedFiles.push(file); // Store the file for submission
  
        // ✅ Create Image Preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  
  removeImage(index: number): void {
    if (index < this.existingImages.length) {
      this.removedImages.push(this.existingImages[index]); // Track removed existing images
      this.existingImages.splice(index, 1);
    } else {
      const newIndex = index - this.existingImages.length;
      this.selectedFiles.splice(newIndex, 1);
    }
    this.imagePreviews.splice(index, 1);
  }

  submitPost(): void {
    if (this.postForm.invalid) {
        console.error("❌ Form is invalid. Please check your inputs.");
        return;
    }

    const formData = new FormData();
    formData.append('caption', this.postForm.value.caption);

    // ✅ Append new files correctly
    this.selectedFiles.forEach((file) => {
        formData.append('images[]', file);
    });

    // ✅ Append removed images correctly
    this.removedImages.forEach((img) => {
        formData.append('removedImages[]', img);
    });

    // ✅ Send request to update the post
    this.adminService.updateBarangayPost(this.postId, formData).subscribe(
      (response) => {
          console.log("✅ Post updated successfully:", response);
          
          // ✅ Update local UI state
          this.imagePreviews = response.post.images; // Update image previews
          this.postForm.patchValue({ caption: response.post.caption }); // Update caption

          this.dialogRef.close(true); // ✅ Close modal after update
      },
      (error) => {
          console.error("❌ Error updating post:", error);
      }
    );
}


  closeDialog() {
    this.dialogRef.close();
  }
}
