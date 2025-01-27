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
  context: string;

  constructor(
    public dialogRef: MatDialogRef<ViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private as: AdminDataService,
    
  ) {this.context = data.context;}

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.id = this.data.id;  
    this.fetchPostData();
    console.log(this.data.context); // Logs the context (should be 'componentA' or 'componentB')
    console.log(this.data.id); 
  }

  fetchPostData() {
    this.as.getPostById(this.id).subscribe(
      (data) => {
        console.log('Fetched Post Data:', data); 
        this.post = data.post; 
      },
      (error) => {
        console.error('Error fetching post data', error);
      }
    );
  }

  // FOR AGRI ADMIN
  deletePost(id: number) {
    Swal.fire({
      title: 'Delete Post?',
      text: 'This action can\'t be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.deletePost(id).subscribe({
          next: () => {
            this.dialogRef.close(true); // Notify parent of changes
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
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
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

  // FOR USER APPROVED POSTS?
  removePost() {
    Swal.fire({
      title: 'Remove user post?',
      text: `This action can\'t be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeDialog();
        Swal.fire({
          title: "Post Removed!",
          text: "The user post has been removed.",
          icon: "success",
          iconColor: '#689f7a',
          confirmButtonText: 'Close',
          confirmButtonColor: "#7f7f7f",
          timer: 5000,
          scrollbarPadding: false
        });
      }
    });
  }
}
