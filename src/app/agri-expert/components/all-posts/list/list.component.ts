import { Component } from '@angular/core';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['date', 'name', 'category', 'title', 'action'];
  dataSource = ELEMENT_DATA;

  constructor (
    private dialog: MatDialog,
  ) {}

  // UPLOADING POPUP
  uploadIdea() {
    if (this.dialog) {
      this.dialog.open(UploadComponent)
    } else {
      console.error('Uploading form not found');
    }
  }

  // DELETE PROCESS
  deletePost() {
    Swal.fire({
      title: 'Delete User Post',
      text: `Are you sure you want to delete this post?`,
      icon: 'warning',
      iconColor: '#FFCE54',
      customClass: { popup: 'swal-font' },
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Post Deleted!",
          text: "The post has been deleted.",
          customClass: { popup: 'swal-font' },
          icon: "success",
          iconColor: '#9EB3AA',
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
