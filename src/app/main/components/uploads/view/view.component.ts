import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';

@Component({
  selector: 'app-view-mypost',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  
  id!: number;  // To store the post ID
  post: any;       // To store the post data

  constructor(
    private router: Router,
    private ds: DataserviceService,
    private route: ActivatedRoute  // Inject ActivatedRoute to get route parameters
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');  // Capture 'id' parameter
      if (id) {
        this.id = +id;  // Convert to a number
        this.fetchPostData();
      } else {
        console.error('Post ID not found');
      }
    });
  }
  
  fetchPostData() {
    this.ds.getPost(this.id).subscribe( 
      (data) => {
        this.post = data; 
      },
      (error) => {
        console.error('Error fetching post data', error);
      }
    );
  }

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
        // Replace this with your actual delete logic
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
