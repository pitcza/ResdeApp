import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AdminDataService } from '../../../../services/admin-data.service';

@Component({
  selector: 'app-view-pending',
  templateUrl: './view-pending.component.html',
  styleUrl: './view-pending.component.scss'
})
export class ViewPendingComponent {

  id: number | undefined;
  post: any; 

  constructor(private route: ActivatedRoute, private router: Router, private as: AdminDataService) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Viewing post with ID:', this.id);

    if (this.id) {
      this.fetchPostDetails(this.id);
    }
  }

  fetchPostDetails(id: number): void {
    this.as.getPostById(id).subscribe(
      (response) => {
        console.log('Post Details:', response);
        this.post = response.post; 
      },
      (error) => {
        console.error('Error fetching post details:', error);
      }
    );
  }
  
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
