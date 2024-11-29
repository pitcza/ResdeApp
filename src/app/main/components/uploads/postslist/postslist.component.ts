import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-postslist',
  templateUrl: './postslist.component.html',
  styleUrl: './postslist.component.scss'
})
export class PostslistComponent implements OnInit {
  displayedColumns: string[] = ['date', 'category', 'title', 'status', 'action'];
  dataSource: TableElement[] = [];
  id: any|string;

  constructor (
    private ds: DataserviceService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserPost();
  }

  fetchUserPost() {
    this.ds.getUserPosts().subscribe(
      response => {
        console.log('API Response:', response);

        const posts = response.posts ? response.posts as TableElement[] : [];
        
        if (Array.isArray(posts)) {
          this.dataSource = posts;
          // this.cdr.detectChanges();
        } else {
          console.error('Error: posts data is not an array');
        }
      },
      error => {
        console.error('Error fetching posts:', error);
      }
    )
  }

  viewPost(id: number) {
    this.router.navigate(['view-post', id]);
  }

  // DELETE PROCESS
  deletePost(id: number) {
    Swal.fire({
      title: 'Delete Post',
      text: 'Are you sure you want to delete your post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.deletePost(id).subscribe(
          () => {
            // Remove the deleted post from dataSource
            this.dataSource = this.dataSource.filter(post => post.id !== id);
            this.cdr.detectChanges();

            Swal.fire({
              title: 'Post Deleted!',
              text: 'The post has been deleted.',
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: '#777777',
              timer: 5000,
              scrollbarPadding: false
            });
          },
          error => {
            console.error('Error deleting post:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error deleting the post.',
              icon: 'error',
              confirmButtonText: 'Close',
              confirmButtonColor: '#777777',
              timer: 5000,
              scrollbarPadding: false
            });
          }
        );
      }
    });
  }
}


export interface TableElement {
  created_at?: string;
  category?: string;
  title: string;
  status?: string;
  id: number;
}