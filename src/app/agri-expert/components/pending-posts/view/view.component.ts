import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  constructor(private router: Router) {}

  // APPROVE PROCESS
  approvePost() {
    Swal.fire({
      title: 'Approve Post',
      text: `Are you sure you want to approve this post?`,
      icon: 'warning',
      iconColor: '#FFCE54',
      customClass: { popup: 'swal-font' },
      showCancelButton: true,
      confirmButtonColor: '#404B43',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      this.router.navigate(['agri-admin/pendingposts/list']); 
      if (result.isConfirmed) {
        Swal.fire({
          title: "Post Approved!",
          text: "The post has been approved.",
          customClass: { popup: 'swal-font' },
          icon: "success",
          iconColor: '#9EB3AA',
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
      iconColor: '#FFCE54',
      customClass: { popup: 'swal-font' },
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['agri-admin/pendingposts/list']); 
        Swal.fire({
          title: "Post Declined!",
          text: "The post has been declined.",
          customClass: { popup: 'swal-font' },
          icon: "success",
          iconColor: '#9EB3AA',
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          timer: 5000,
          scrollbarPadding: false
        });
      }
    });
  }

}
