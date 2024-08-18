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
      text: `Are you sure you want to upload a post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#404B43',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['main/uploads/list']); 
        Swal.fire({
          title: "Post Pending",
          text: "Waiting for the admin approval.",
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
