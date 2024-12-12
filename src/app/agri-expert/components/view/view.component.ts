import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewComponent>,
    private dialog: MatDialog,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  // FOR AGRI ADMIN
  deletePost() {
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
        this.closeDialog();
        Swal.fire({
          title: "Post Deleted!",
          text: "The post has been deleted.",
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


  // FOR USER PENDING POSTS
  approvePost() { // APPROVE PROCESS
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
        this.closeDialog();
        Swal.fire({
          title: "Post Approved!",
          text: "The user post has been approved.",
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

  declinePost() { // DECLINE PROCESS
    Swal.fire({
      title: 'Decline Post',
      text: 'Are you sure you want to decline this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Decline Post',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeDialog();
        Swal.fire({
          title: "Post Declined!",
          text: "The user post has been declined.",
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
