import { Component } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['date', 'name', 'category', 'title', 'action'];
  dataSource = ELEMENT_DATA;

  // DELETE PROCESS
  deletePost() {
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
        Swal.fire({
          title: "Post Deleted!",
          text: "The post has been deleted.",
          icon: "success",
          confirmButtonText: 'Close',
          confirmButtonColor: "#777777",
          timer: 5000,
          scrollbarPadding: false
        });
      }
    });
  }
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
