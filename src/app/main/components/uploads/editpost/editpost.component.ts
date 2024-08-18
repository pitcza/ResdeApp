import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.component.html',
  styleUrl: './editpost.component.scss'
})
export class EditpostComponent {
  constructor(private router: Router) {}

  // Confirmation function
  updatePost() {
    Swal.fire({
      title: 'Update Post',
      text: `Are you sure you want to update your post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#404B43',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['main/uploads/list']); 
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          text: 'Post has been updated.',
        });
    }
    });
  }

}
