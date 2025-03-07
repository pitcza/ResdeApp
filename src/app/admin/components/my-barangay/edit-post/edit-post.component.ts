import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminDataService } from '../../../../services/admin-data.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent implements OnInit {
  postForm: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  postId!: number;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditPostComponent>,
    private adminService: AdminDataService,
    private route: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      caption: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log('Route Params:', params);
      const id = params.get('id');
      if (id) {
        this.postId = Number(id);
        this.loadPostData();
      } else {
        console.error('Post ID is missing or invalid.');
      }
    });
  }
  

  loadPostData(): void {
    this.adminService.getBarangayPostById(this.postId).subscribe(
      (post) => {
        this.postForm.patchValue({ caption: post.caption });
        if (post.images) {
          this.imagePreviews = post.images;
        }
      },
      (error) => console.error('Error loading post:', error)
    );
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        const filesArray = Array.from(input.files); // ✅ Convert FileList to an Array
        for (let file of filesArray) {
            this.selectedFiles.push(file);
            const reader = new FileReader();
            reader.onload = (e) => this.imagePreviews.push(e.target!.result as string);
            reader.readAsDataURL(file);
        }
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  submitPost(): void {
    const formData = new FormData();
    formData.append('caption', this.postForm.value.caption);

    this.selectedFiles.forEach((file) => {
      formData.append('images[]', file);
    });

    this.adminService.updateBarangayPost(this.postId, formData).subscribe(
      (response) => {
        console.log('Post updated:', response);
      },
      (error) => console.error('Error updating post:', error)
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}