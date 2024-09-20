import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-mypost',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  constructor(private router: Router) {}

  deletePost() {
    Swal.fire({
      title: 'Delete Post',
      text: `Are you sure you want to delete your post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['main/uploads/list']); 
        Swal.fire({
          title: "Post Deleted!",
          text: "The post has been deleted.",
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
