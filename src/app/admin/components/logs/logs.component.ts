import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminDataService } from '../../../services/admin-data.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['timestamp', 'name', 'role', 'action'];
  dataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  filteredDataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  categoryFilter: string = '';
  statusFilter: string = '';
  searchQuery: string = '';
  isLoading: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor (
    private as: AdminDataService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}
  
  ngOnInit(): void {
    this.fetchLogs();
  }

  // fetchLogs() {
  //   this.isLoading = true;
  //   this.as.getLogs().subscribe(
  //     (response: TableElement[]) => {
  //       this.dataSource.data = response; 
  //       this.filteredDataSource.data = this.dataSource.data; 
  //       this.cdr.detectChanges();
  //       this.isLoading = false;
  //       console.log(this.dataSource.data); 
  //     },
  //     (error) => {
  //       console.error('Error fetching logs:', error);
  //       this.isLoading = false;
  //     }
  //   );
  // }

  fetchLogs() {
    this.isLoading = true;
    this.as.getLogs().subscribe(
      (response: TableElement[]) => {
        const modifiedResponse = response.map(item => {
          switch (item.role) {
            case 'agri':
              item.role = 'Environmental Admin';
              break;
            case 'admin':
              item.role = 'Admin';
              break;
            case 'user':
              item.role = 'User';
              break;
            case 'sangukab':
              item.role = 'Sk Admin';
              break;
          }
          return item;
        });

        this.dataSource.data = modifiedResponse;
        this.filteredDataSource.data = this.dataSource.data;
        this.cdr.detectChanges();
        this.isLoading = false;
        console.log(this.dataSource.data);
      },
      (error) => {
        console.error('Error fetching logs:', error);
        this.isLoading = false;
      }
    );
  }


  ngAfterViewInit() {
    this.filteredDataSource.paginator = this.paginator;
    
    this.cdr.detectChanges();
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value.toLowerCase(); 
    this.filterPosts(); 
  }

  onCategoryChange(event: any) {
    this.categoryFilter = event.target.value;
    this.filterPosts();
  }

  onStatusChange(event: any) {
    this.statusFilter = event.target.value || '';
    this.filterPosts();
  }

  filterPosts() {
    const filteredData = this.dataSource.data.filter((log) => {
      const categoryMatch = !this.categoryFilter || log.role.toLowerCase() === this.categoryFilter.toLowerCase();
      const statusMatch = !this.statusFilter || log.action.toLowerCase().includes(this.statusFilter.toLowerCase());
      const searchMatch =
        !this.searchQuery ||
        log.first_name.toLowerCase().includes(this.searchQuery) || 
        log.last_name.toLowerCase().includes(this.searchQuery) ||  
        log.action.toLowerCase().includes(this.searchQuery);      

      return categoryMatch && statusMatch && searchMatch;
    });

    this.filteredDataSource.data = filteredData;

    if (this.filteredDataSource.paginator) {
      this.filteredDataSource.paginator.firstPage();
    }

    this.cdr.detectChanges();
  }
}

export interface TableElement {
  first_name: string;
  last_name: string;
  role: string;
  action: string;
  timestamp: string;
}