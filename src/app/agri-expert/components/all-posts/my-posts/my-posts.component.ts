import { Component } from '@angular/core';

import Swal from 'sweetalert2';
import { ViewComponent } from '../../view/view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent {
  displayedColumns: string[] = ['date', 'name', 'category', 'title', 'action'];
  dataSource = ELEMENT_DATA;

  constructor (
    private dialog: MatDialog,
  ) {}

  // VIEWING POST POPUP
  viewPost() {
    if (this.dialog) {
      this.dialog.open(ViewComponent, {
      });
    } else {
      console.error('View popup not found');
    }
  }

  // DELETE PROCESS
  deletePost() {
    Swal.fire({
      title: 'Delete Post?',
      text: 'This action can\'t be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Post Deleted!",
          text: "Your post has been deleted.",
          icon: "success",
          iconColor: '#689f7a',
          confirmButtonText: 'Close',
          confirmButtonColor: "#7f7f7f",
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
