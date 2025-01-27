import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminDataService } from '../../../../services/admin-data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ViewPendingComponent } from '../view-pending/view-pending.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'name', 'category', 'title', 'status', 'action'];
  dataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  categoryFilter: string = '';
  statusFilter: string = '';
  fromDate: string = '';  // For the "from" date
  toDate: string = '';    // For the "to" date
  isLoading: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private AS: AdminDataService,
    private cdr: ChangeDetectorRef,
    private dialog:MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchPosts(); 
  }

  ngAfterViewInit(): void {
    this.filteredDataSource.paginator = this.paginator;
  }

  fetchPosts() {
    this.isLoading = true;
    const params = {
      start_date: this.fromDate,
      end_date: this.toDate
    };

    this.AS.allPosts(params).subscribe(
      response => {
        console.log('API Response:', response);
  
        const posts = response.posts ? Object.values(response.posts).filter((post: any) => post.status === 'pending') as TableElement[] : [];
  
        if (Array.isArray(posts)) {
          this.dataSource.data = posts;
          this.filteredDataSource.data = posts;
          this.filteredDataSource.paginator = this.paginator
          this.isLoading = false;
        } else {
          console.error('Error: posts data is not an array');
        }
      },
      error => {
        console.error('Error fetching posts:', error);
      }
    );
  }

filterPosts() {
  const selectedCategory = this.categoryFilter;

  this.filteredDataSource.data = this.dataSource.data.filter(post => {
    const categoryMatch = selectedCategory ? post.category?.toLowerCase() === selectedCategory.toLowerCase() : true;
   
    // Date filter logic
    const postDate = post.created_at ? new Date(post.created_at) : null;  // Check for undefined or null created_at
    const fromDateMatch = this.fromDate ? postDate && postDate >= new Date(this.fromDate) : true;
    const toDateMatch = this.toDate ? postDate && postDate <= new Date(this.toDate) : true;

    return categoryMatch && fromDateMatch && toDateMatch;
  });

  this.cdr.detectChanges();
}

  onCategoryChange(event: any) {
    this.categoryFilter = event.target.value;
    this.filterPosts();
  }

  onDateChange(event: any, type: string) {
    const selectedDate = event.target.value;
    if (type === 'from') {
      this.fromDate = selectedDate;
    } else if (type === 'to') {
      this.toDate = selectedDate;
    }
  
    this.filterPosts(); 
  }
  
  // APPROVE PROCESS
  approvePost(id: number) {
    Swal.fire({
      title: 'Approve Post',
      text: `Are you sure you want to approve this post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4d745a',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AS.approvePost(id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(post => post.id !== id);
            this.filteredDataSource.data = this.filteredDataSource.data.filter(post => post.id !== id);
        
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
          error: (err) => {
            Swal.fire({
              title: "Error",
              text: "There was an error approving the post.",
              icon: "error",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777"
            });
          }
      });
      }
    });
  }

  // REJECT PROCESS
//   rejectPost(id: number) {
//     Swal.fire({
//       title: 'Reject Post',
//       text: `Are you sure you want to reject this post?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#AB0E0E',
//       cancelButtonColor: '#777777',
//       confirmButtonText: 'Yes',
//       cancelButtonText: 'Cancel'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.AS.rejectPost(id).subscribe(
//           response => {
//         Swal.fire({
//           title: "Post Rejected!",
//           text: "The post has been rejected.",
//           icon: "success",
//           confirmButtonText: 'Close',
//           confirmButtonColor: "#777777",
//           timer: 5000,
//           scrollbarPadding: false
//         });
//       },
//       error => {
//         Swal.fire({
//           title: "Error",
//           text: "There was an error declining the post.",
//           icon: "error",
//           confirmButtonText: 'Close',
//           confirmButtonColor: "#777777"
//         });
//       }
//     );
//   }
// });
//   }

rejectPost(id: number) {
  Swal.fire({
    title: 'Decline Post',
    text: 'Are you sure you want to decline this post?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#AB0E0E',
    cancelButtonColor: '#777777',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    input: 'textarea',
    inputPlaceholder: 'Enter your remarks...',
    inputAttributes: {
      'aria-label': 'Type your remarks here'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const remarks = result.value;  

      this.AS.rejectPost(id, remarks).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(post => post.id !== id);
          this.filteredDataSource.data = this.filteredDataSource.data.filter(post => post.id !== id);

          Swal.fire({
            title: "Post Declined!",
            text: "The post has been declined.",
            icon: "success",
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777",
            timer: 5000,
            scrollbarPadding: false
          });
        },
        error: (err) => {
          Swal.fire({
            title: "Error",
            text: "There was an error.",
            icon: "error",
            confirmButtonText: 'Close',
            confirmButtonColor: "#777777"
          });
        }
      });
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


