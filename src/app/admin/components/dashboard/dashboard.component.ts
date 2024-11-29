import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminDataService } from '../../../services/admin-data.service';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  displayedColumns: string[] = ['fullName', 'title', 'status', 'date'];
  dataSource: MatTableDataSource<Element>;
  pendingPostsCount: number = 0;
  totalPostsCount: number = 0;
  DeclinedCount: number = 0;
  users: number = 0;

  constructor(
    private AS: AdminDataService,
    ) 
    {
      const sortedData = ELEMENT_DATA.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.dataSource = new MatTableDataSource(sortedData.slice(0, 10));
    }


  ngOnInit(): void {
      this.getPendingPostsCount();
      this.getPostsCount();
      this.getDeclinedCount();
      this.getTotalUsers();
    }

    getPendingPostsCount(): void {
      this.AS.TotalPendingPosts().subscribe(
        (response) => {
          this.pendingPostsCount = response['Pending posts of resit'];
        },
        (error) => {
          console.error('Error fetching pending posts count', error);
        }
      );
    }

    getPostsCount(): void {
      this.AS.TotalPosts().subscribe(
        (response) => {
          this.totalPostsCount = response['Total posts of resit'];
        },
        (error) => {
          console.error('Error fetching total posts count', error);
        }
      );
    }

    getDeclinedCount(): void {
      this.AS.TotalDeclinedPosts().subscribe(
        (response) => {
          this.DeclinedCount = response['Declined posts of resit'];
        },
        (error) => {
          console.error('Error fetching total posts count', error);
        }
      );
    }

    getTotalUsers(): void {
      this.AS.TotalUsers().subscribe(
        (response) => {
          this.users = response['Total users of resit app'];
        },
        (error) => {
          console.error('Error fetching total posts count', error);
        }
      );
    }

}

// sample data
export interface Element {
  fullName: string;
  title: string;
  status: string;
  date: string;
}

const ELEMENT_DATA: Element[] = [
  { fullName: 'John Doe', title: 'Developer', status: 'Pending', date: '2024-08-01' },
  { fullName: 'Jane Smith', title: 'Designer', status: 'Pending', date: '2024-08-02' },
  // Add 8 more rows here
];