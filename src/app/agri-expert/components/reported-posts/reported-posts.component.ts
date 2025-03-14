import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AdminDataService } from '../../../services/admin-data.service';
import { ViewComponent } from '../view/view.component';

@Component({
  selector: 'app-reported-posts',
  templateUrl: './reported-posts.component.html',
  styleUrl: './reported-posts.component.scss'
})
export class ReportedPostsComponent implements OnInit , AfterViewInit{
  displayedColumns: string[] = ['date', 'name', 'category', 'report_count', 'report_reasons', 'report_remarks', 'action'];
  dataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  fromDate: string = '';
  toDate: string = '';
  isLoading: boolean = true;
  searchQuery: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private as: AdminDataService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchPosted();
  }

  ngAfterViewInit(): void {
    this.filteredDataSource.paginator = this.paginator;
  }

  viewPost(id: number) {
    if (this.dialog) {
      this.dialog.open(ViewComponent, {
        data: { id: id }  
      });
    } else {
      console.error('View popup not found');
    }
  }

  formatReasons(report_reasons: string): string {
    try {
        const parsedReasons = JSON.parse(report_reasons);
        return Array.isArray(parsedReasons) ? parsedReasons.join(', ') : 'No reasons listed';
    } catch {
        return 'No reasons listed';
    }
  }

  fetchPosted() {
    this.isLoading = true;

    this.as.reportedPosts().subscribe({
      next: (response: TableElement[]) => {
        this.dataSource.data = response
          .map((post: TableElement) => ({
            ...post,
            fname: post.fname || 'N/A',
            lname: post.lname || 'N/A',
            created_at: post.created_at ? new Date(post.created_at).toISOString() : '1970-01-01T00:00:00Z' // Default if missing
          }))
          .sort((a, b) => {
            return new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime();
          });

        this.filteredDataSource.data = this.dataSource.data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    });
  }

  filterPosts() {
    const searchLower = this.searchQuery.toLowerCase();
  
    this.filteredDataSource.data = this.dataSource.data.filter(post => {
  
      // Date filter logic
      const postDate = post.created_at ? new Date(post.created_at) : null;  // Check for undefined or null created_at
      const fromDateMatch = this.fromDate ? postDate && postDate >= new Date(this.fromDate) : true;
      const toDateMatch = this.toDate ? postDate && postDate <= new Date(this.toDate) : true;

      // Search Filter (Matches name or title)
      const fnameMatch = post.fname?.toLowerCase().includes(searchLower);
      const lnameMatch = post.lname?.toLowerCase().includes(searchLower);
      const titleMatch = post.title?.toLowerCase().includes(searchLower);
      const reasonsMatch = post.report_reasons?.toLowerCase().includes(searchLower);
      const remarksMatch = post.report_remarks?.toLowerCase().includes(searchLower);
      const searchMatch = !this.searchQuery || fnameMatch || lnameMatch || titleMatch || reasonsMatch || remarksMatch ;
  
      return fromDateMatch && toDateMatch && searchMatch;
    });
  
    this.filteredDataSource.data.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
    
    this.cdr.detectChanges();
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
  
  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.filterPosts();
  }

  deletePost(id: number): void {
    Swal.fire({
      title: 'Remove User Post',
      text: 'Are you sure you want to remove this post?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#CC4646',
      cancelButtonColor: '#7F7F7F',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Removal Remarks',
          input: 'text',
          inputPlaceholder: 'Enter your reason for removing this post',
          showCancelButton: true,
          confirmButtonColor: '#CC4646',
          cancelButtonColor: '#7F7F7F',   
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          inputValidator: (value) => {
            if (!value || value.trim().length === 0) {
              return 'Remarks are required.';
            }
            return null;
          }
        }).then((inputResult) => {
          if (inputResult.isConfirmed) {
            // Send delete request with remarks
            this.as.deletePost(id, inputResult.value).subscribe({
              next: (response) => {
                Swal.fire('Removed!', 'The post has been marked for deletion.', 'success');
              },
              error: (error) => {
                Swal.fire('Error!', 'Failed to delete post. Please try again.', 'error');
              }
            });
          }
        });
      }
    });
  }
}

export interface TableElement {
  created_at?: string;
  category?: string;
  title?: string;
  report_count?: string;
  report_reasons?: string;
  report_remarks?: string;
  id: number;
  fname?: string;
  lname?: string;
}