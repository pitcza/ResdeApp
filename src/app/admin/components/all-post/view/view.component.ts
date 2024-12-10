import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AdminDataService } from '../../../../services/admin-data.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {
  
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

  deletePost(id: number): void {
    Swal.fire({
      title: 'Delete User Post',
      text: `Are you sure you want to delete this post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.deletePost(id).subscribe({
          next: () => {
            Swal.fire({
              title: "Post Deleted!",
              text: "The post has been deleted.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              timer: 5000,
              scrollbarPadding: false
            });
  
            this.router.navigate(['admin/all-post/list']);
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
  

}
