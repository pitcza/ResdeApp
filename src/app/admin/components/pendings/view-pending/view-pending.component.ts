import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-pending',
  templateUrl: './view-pending.component.html',
  styleUrl: './view-pending.component.scss'
})
export class ViewPendingComponent {
  constructor(private router: Router) {}

  // APPROVE PROCESS
  approvePost() {
    Swal.fire({
      title: 'Approve Post',
      text: `Are you sure you want to approve this post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#404B43',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      this.router.navigate(['admin/pendings/approved-posts']); 
      if (result.isConfirmed) {
        Swal.fire({
          title: "Post Approved!",
          text: "The post has been approved.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          timer: 5000,
          scrollbarPadding: false
        });
      }
    });
  }

  // DECLINE PROCESS
  declinePost() {
    Swal.fire({
      title: 'Decline Post',
      text: `Are you sure you want to decline this post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['admin/pendings/list-of-posts']); 
        Swal.fire({
          title: "Post Declined!",
          text: "The post has been declined.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          timer: 5000,
          scrollbarPadding: false
        });
      }
    });
  }

}
