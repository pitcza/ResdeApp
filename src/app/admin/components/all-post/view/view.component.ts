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
            this.dialogRef.close(true);
            Swal.fire({
              title: "Post Deleted!",
              text: "The post has been deleted.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              timer: 5000,
              scrollbarPadding: false
            });  
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
  


  // FOR USER PENDING POSTS
  approvePost(id: number) { // APPROVE PROCESS
    Swal.fire({
      title: 'Approve Post',
      text: 'Are you sure you want to approve this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4d745a',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Approve Post',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.approvePost(id).subscribe({
          next: () => {
            this.dialogRef.close(true); // Notify parent of changes
            Swal.fire({
                title: "Post Approved!",
                text: "The post has been approved.",
                icon: "success",
                confirmButtonText: 'Close',
                confirmButtonColor: "#777777",
                timer: 5000,
                scrollbarPadding: false
              });
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "There was an error approving the post.",
              icon: "error",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777"
            });
            console.error(err);
          }
        });
      }
    });
  }

  declinePost(id: number) {
    Swal.fire({
      title: 'Decline Post',
      text: 'Are you sure you want to decline this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Decline',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      input: 'textarea',  
      inputPlaceholder: 'Enter your remarks...',
      inputAttributes: {
        'aria-label': 'Type your remarks here'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const remarks = result.value;  
  
        this.as.rejectPost(id, remarks).subscribe({
          next: () => {
            this.dialogRef.close(true);
            Swal.fire({
              title: "Post Declined!",
              text: "The post has been declined.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              timer: 5000,
              scrollbarPadding: false
            });
          },
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "There was an error.",
              icon: "error",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777"
            });
          }
        });
      }
    });
  }
}
