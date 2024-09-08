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

  // DELETE PROCESS
  deletePost() {
    Swal.fire({
      title: 'Delete User Post',
      text: `Are you sure you want to delete this post?`,
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
        this.router.navigate(['agri-admin/allposts/list']); 
        Swal.fire({
          title: "Post Deleted!",
          text: "The post has been deleted.",
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

