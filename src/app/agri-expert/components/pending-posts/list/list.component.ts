import { Component } from '@angular/core';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['date', 'name', 'category', 'title', 'status', 'action'];
  dataSource = ELEMENT_DATA;

  // APPROVE PROCESS
  approvePost() {
    Swal.fire({
      title: 'Approve Post',
      text: `Are you sure you want to approve this post?`,
      icon: 'warning',
      iconColor: '#FFCE54',
      customClass: { popup: 'swal-font' },
      showCancelButton: true,
      confirmButtonColor: '#404B43',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Post Approved!",
          text: "The post has been approved.",
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

  // REJECT PROCESS
  rejectPost() {
    Swal.fire({
      title: 'Decline Post',
      text: `Are you sure you want to decline this post?`,
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
          title: "Post Declined!",
          text: "The post has been declined.",
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
  status: string;
}

const ELEMENT_DATA: TableElement[] = [
  { date: '2024-08-17', name: 'Sample Name', category: 'Category1', title: 'Title1', status: 'Pending' },
  { date: '2024-08-16', name: 'Sample Name', category: 'Category2', title: 'Title2', status: 'Pending'},
];