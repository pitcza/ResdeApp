import { Component } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-postslist',
  templateUrl: './postslist.component.html',
  styleUrl: './postslist.component.scss'
})
export class PostslistComponent {
  displayedColumns: string[] = ['date', 'category', 'title', 'status', 'action'];
  dataSource = ELEMENT_DATA;

  // DELETE PROCESS
  deletePost() {
    Swal.fire({
      title: 'Delete Post',
      text: `Are you sure you want to delete your post?`,
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
  category: string;
  title: string;
  status: string;
}

const ELEMENT_DATA: TableElement[] = [
  { date: 'Jan. 24, 2023', category: 'Miscellaneous Products', title: 'Title1', status: 'Uploaded' },
  { date: '2024-08-16', category: 'Category2', title: 'Title2', status: 'Pending'},
  { date: '2024-08-16', category: 'Category2', title: 'Title2', status: 'Declined'},
];
