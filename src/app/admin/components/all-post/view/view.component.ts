import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AdminDataService } from '../../../../services/admin-data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-post',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit{
  
  id!: number;  // To store the post ID
  post: any;       // To store the post data

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
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
    this.as.getPostById(id).subscribe(
      (data) => {
        console.log('Fetched Post Data:', data); // Add this line to inspect the data
        this.post = data.post; // Accessing 'post' within the response
      },
      (error) => {
        console.error('Error fetching post data', error);
      }
    );
  }

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }

  deletePost(id: number): void {
    Swal.fire({
      title: 'Delete User Post',
      text: `Are you sure you want to delete this post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.deletePost(id).subscribe({
          next: () => {
            Swal.fire({
              title: "Post Deleted!",
              text: "The post has been deleted.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              timer: 5000,
              scrollbarPadding: false
            });
  
            this.router.navigate(['admin/all-post/list']);
          },
          error: (err) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the post. Please try again.",
              icon: "error",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false
            });
            console.error(err);
          }
        });
      }
    });
  }
  

}
