import { Component } from '@angular/core';

@Component({
  selector: 'app-approved-list',
  templateUrl: './approved-list.component.html',
  styleUrl: './approved-list.component.scss'
})
export class ApprovedListComponent {
  displayedColumns: string[] = ['date', 'name', 'category', 'title', 'action'];
  dataSource = ELEMENT_DATA;
}


export interface TableElement {
  date: string;
  name: string;
  category: string;
  title: string;
}

const ELEMENT_DATA: TableElement[] = [
  { date: '2024-08-17', name: 'Sample Name', category: 'Category1', title: 'Title1' },
  { date: '2024-08-16', name: 'Sample Name', category: 'Category2', title: 'Title2'},
];
