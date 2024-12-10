import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditpostComponent } from '../editpost/editpost.component';

@Component({
  selector: 'app-view-mypost',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  
  id!: number;  // To store the post ID
  post: any;       // To store the post data

  constructor(
    public dialogRef: MatDialogRef<ViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private router: Router,
    private ds: DataserviceService,
    private route: ActivatedRoute  // Inject ActivatedRoute to get route parameters
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.id = this.data.id;  
    this.fetchPostData();
   
  }
  
  fetchPostData() {
    this.ds.getPost(this.id).subscribe(
      (data) => {
        console.log('Fetched Post Data:', data); // Add this line to inspect the data
        this.post = data.post; // Accessing 'post' within the response
      },
      (error) => {
        console.error('Error fetching post data', error);
      }
    );
  }

  // EDITING POST POPUP
  editPost(id: number) {
    if (this.dialog) {
      this.dialog.open(EditpostComponent);
      this.closeDialog();
    } else {
      console.error('not found');
    }
  }

  deletePost() {
    Swal.fire({
      title: 'Delete Post?',
      text: 'This action can\'t be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C14141',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeDialog();
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
