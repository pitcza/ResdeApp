import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { AdminDataService } from '../../../services/admin-data.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnInit {
  id!: number;
  post: any;

  constructor(
    private as: AdminDataService,
    public dialogRef: MatDialogRef<ViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.fetchPostDetails(this.id);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  fetchPostDetails(id: number): void {
    this.as.getPostById(id).subscribe({
      next: (response) => {
        if (response.post) {
          this.post = response.post;
          this.post.image = response.image; // Assign full image URL
          this.post.total_likes = response.total_likes;
          this.post.user_name = `${response.fname} ${response.lname}`;
        } else {
          console.error("Invalid response format:", response);
        }
      },
      error: (error) => {
        console.error('Error fetching post:', error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch post details.",
          icon: "error",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777"
        });
      }
    });
  }

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }

  deletePost(id: number): void {
    Swal.fire({
      title: 'Remove User Post',
      text: 'Are you sure you want to remove this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#CC4646',
      cancelButtonColor: '#7F7F7F',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Removal Remarks',
          input: 'text',
          inputPlaceholder: 'Enter your reason for removing this post',
          showCancelButton: true,
          confirmButtonColor: '#CC4646',
          cancelButtonColor: '#7F7F7F',   
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          inputValidator: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Remarks are required.';
            }
            return null;
          }
        }).then((inputResult) => {
          if (inputResult.isConfirmed) {
            // Send delete request with remarks
            this.as.deletePost(id, inputResult.value).subscribe({
              next: (response) => {
                Swal.fire('Removed!', 'The post has been marked for deletion.', 'success');
                this.closeDialog();
              },
              error: (error) => {
                Swal.fire('Error!', 'Failed to delete post. Please try again.', 'error');
              }
            });
          }
        });
      }
    });
  }
}
