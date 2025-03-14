import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminDataService } from '../../../../services/admin-data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ViewComponent } from '../../all-post/view/view.component';

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

  viewPost(id: number) {
    if (this.dialog) {
      this.dialog.open(ViewComponent, {
        data: { id: id }  
      });
    } else {
      console.error('View popup not found');
    }
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


