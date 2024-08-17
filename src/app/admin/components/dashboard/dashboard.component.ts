import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  displayedColumns: string[] = ['fullName', 'title', 'status', 'date'];
  dataSource: MatTableDataSource<Element>;

  constructor() {
    // Sort data by date (oldest first) and then take the first 10 entries
    const sortedData = ELEMENT_DATA.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.dataSource = new MatTableDataSource(sortedData.slice(0, 10));
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