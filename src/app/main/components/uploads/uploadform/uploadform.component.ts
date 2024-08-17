import { Component } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-uploadform',
  templateUrl: './uploadform.component.html',
  styleUrl: './uploadform.component.scss'
})
export class UploadformComponent {
  constructor(private router: Router) {}

  // Confirmation function
  confirmAction() {
    Swal.fire({
      title: 'Upload Post',
      text: `You are about to upload your idea?`,
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
          title: 'Post Pending',
          text: `Wait for Approval`,
        });
    }
    });
  }

}
