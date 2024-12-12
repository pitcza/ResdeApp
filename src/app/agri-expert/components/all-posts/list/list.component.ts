import { Component } from '@angular/core';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UploadComponent } from '../upload/upload.component';
import { ViewComponent } from '../../view/view.component';

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

  // VIEWING POST POPUP
  viewPost() {
    if (this.dialog) {
      this.dialog.open(ViewComponent, {
      });
    } else {
      console.error('View popup not found');
    }
  }

  // UPLOADING POPUP
  uploadIdea() {
    if (this.dialog) {
      this.dialog.open(UploadComponent)
    } else {
      console.error('Uploading form not found');
    }
  }

  // DELETE USER POST PROCESS
  removePost() {
    Swal.fire({
      title: 'Remove user post?',
      text: `This action can\'t be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Post Removed!",
          text: "The user post has been removed.",
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
