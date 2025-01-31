import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UploadComponent } from '../upload/upload.component';
import { ViewComponent } from '../../view/view.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminDataService } from '../../../../services/admin-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'name', 'category', 'title', 'action'];
  dataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  categoryFilter: string = '';
  statusFilter: string = '';
  fromDate: string = '';  // For the "from" date
  toDate: string = '';    // For the "to" date
  isLoading: boolean = true;
  


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor (
    private dialog: MatDialog,
    private as: AdminDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.fetchApproved();
  }

  ngOnInit(): void {
    this. filteredDataSource.paginator = this.paginator;
  }

  fetchApproved() {
    this.isLoading = true;
    const params = {
      start_date: this.fromDate,
      end_date: this.toDate
    };

    this.as.allPosts(params).subscribe(
      response => {
        const posts = response.posts ? Object.values(response.posts).filter((post: any) => post.status === 'approved') as TableElement[] : [];
        
        if (Array.isArray(posts)) {
          this.dataSource.data = posts;
          this.filteredDataSource.data = posts;
          this.filteredDataSource.paginator = this.paginator ;
          this.isLoading = false;
        } else {
          console.error('Error: posts data is not an array');
        }
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

    filterPosts() {
      const selectedCategory = this.categoryFilter;
      const selectedStatus = this.statusFilter;
    
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
  
    onStatusChange(event: any) {
      this.statusFilter = event.target.value;
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

  // VIEWING POST POPUP
  viewPost(id: number, context: string) {
    const dialogRef = this.dialog.open(ViewComponent, {
      data: { id: id, context: context }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchApproved(); // Update data if changes occurred
      }
    });
  }

  // UPLOADING POPUP
  uploadIdea() {
    if (this.dialog) {
      this.dialog.open(UploadComponent)
    } else {
      console.error('Uploading form not found');
    }
  }

  // DELETE USER POST PROCESS
  removePost(id: number): void {
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
              this.dataSource.data = this.dataSource.data.filter(post => post.id !== id);
              this.filteredDataSource.data = this.filteredDataSource.data.filter(post => post.id !== id);
  
              Swal.fire({
                title: "Post Deleted!",
                text: "The post has been deleted.",
                icon: "success",
                confirmButtonText: 'Close',
                confirmButtonColor: "#777777",
                timer: 5000,
                scrollbarPadding: false
              });
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


export interface TableElement {
  created_at?: string;
  name: string;
  category: string;
  title: string;
  id: number;
}
