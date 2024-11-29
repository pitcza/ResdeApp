import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminDataService } from '../../../../services/admin-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['date', 'name', 'category', 'title', 'status', 'action'];
  dataSource: TableElement[] = []; // Initialize an empty array for fetched data

  constructor(private AS: AdminDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchPosts(); 
  }

  fetchPosts() {
    this.AS.getPosts().subscribe(
      response => {
        console.log('API Response:', response);

        const posts = response.posts ? Object.values(response.posts) as TableElement[] : [];
        
        if (Array.isArray(posts)) {
          this.dataSource = posts;
          this.cdr.detectChanges();
        } else {
          console.error('Error: posts data is not an array');
        }
      },
      error => {
        console.error('Error fetching posts:', error);
      }
    );
  }
  
  // APPROVE PROCESS
  approvePost(id: number) {
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
      if (result.isConfirmed) {
        this.AS.approvePost(id).subscribe(
          response => {
            Swal.fire({
              title: "Post Approved!",
              text: "The post has been approved.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              timer: 5000,
              scrollbarPadding: false
            });
          },
          error => {
            Swal.fire({
              title: "Error",
              text: "There was an error approving the post.",
              icon: "error",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777"
            });
          }
        );
      }
    });
  }

  // REJECT PROCESS
  rejectPost(id: number) {
    Swal.fire({
      title: 'Reject Post',
      text: `Are you sure you want to reject this post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AS.rejectPost(id).subscribe(
          response => {
        Swal.fire({
          title: "Post Rejected!",
          text: "The post has been rejected.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          timer: 5000,
          scrollbarPadding: false
        });
      },
      error => {
        Swal.fire({
          title: "Error",
          text: "There was an error declining the post.",
          icon: "error",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777"
        });
      }
    );
  }
});
  }
}

export interface TableElement {
  created_at?: string;  
  fname?: string;    
  lname?: string;
  category?: string;
  title: string;
  status?: string;
  id: number; 
}


