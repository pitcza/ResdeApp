import { Component } from '@angular/core';

import Swal from 'sweetalert2';
import { ViewComponent } from '../../view/view.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['date', 'name', 'category', 'title', 'status', 'action'];
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

  // APPROVE PROCESS
  approvePost() {
    Swal.fire({
      title: 'Approve Post',
      text: `Are you sure you want to approve this post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4d745a',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Approve Post',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Post Approved!",
          text: "The user post has been approved.",
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

  // DECLINE PROCESS
  declinePost() {
    Swal.fire({
      title: 'Decline Post',
      text: `Are you sure you want to decline this post?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Decline Post',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Post Declined!",
          text: "The user post has been declined.",
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
  status: string;
}

const ELEMENT_DATA: TableElement[] = [
  { date: '2024-08-17', name: 'Sample Name', category: 'Category1', title: 'Title1', status: 'Pending' },
  { date: '2024-08-16', name: 'Sample Name', category: 'Category2', title: 'Title2', status: 'Pending'},
];
