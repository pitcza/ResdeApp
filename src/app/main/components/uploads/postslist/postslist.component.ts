import { Component } from '@angular/core';

@Component({
  selector: 'app-postslist',
  templateUrl: './postslist.component.html',
  styleUrl: './postslist.component.scss'
})
export class PostslistComponent {
  displayedColumns: string[] = ['date', 'category', 'title', 'status', 'action'];
  dataSource = ELEMENT_DATA;
}


export interface TableElement {
  date: string;
  category: string;
  title: string;
  status: string;
}

const ELEMENT_DATA: TableElement[] = [
  { date: '2024-08-17', category: 'Category1', title: 'Title1', status: 'Uploaded' },
  { date: '2024-08-16', category: 'Category2', title: 'Title2', status: 'Pending'},
];
