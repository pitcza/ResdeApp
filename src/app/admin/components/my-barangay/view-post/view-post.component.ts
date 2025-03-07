import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminDataService } from '../../../../services/admin-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss']
})
export class ViewPostComponent implements OnInit {
  id!: number;  // To store the post ID
  post: any;       // To store the post data
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminDataService,
    public dialogRef: MatDialogRef<ViewPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.fetchPostDetails(this.id);
  }

  fetchPostDetails(id: number): void {
    this.isLoading = true;
    
    this.adminService.getBarangayPostById(id).subscribe(
      (response) => {
        console.log('Fetched Post Data:', response); // Debug API response
  
        // Check if the response is structured correctly
        this.post = response.post ? response.post : response; 
        
        console.log('Final Post Data:', this.post); // Ensure it has images & caption
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching post data', error);
        this.isLoading = false;
      }
    );
  }
  
  deletePost(postId: number) {
    Swal.fire({
      title: 'Delete Post',
      text: 'Are you sure you want to delete this post? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#266CA9',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteBarangayPost(postId).subscribe(
          () => {
            Swal.fire('Deleted!', 'The post has been deleted.', 'success');
            this.dialogRef.close(true); // Close modal and notify parent to refresh list
          },
          (error) => {
            console.error('Error deleting post:', error);
            Swal.fire('Error', 'Failed to delete the post.', 'error');
          }
        );
      }
    });
  }  

  closeDialog() {
    this.dialogRef.close();
  }

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }
}