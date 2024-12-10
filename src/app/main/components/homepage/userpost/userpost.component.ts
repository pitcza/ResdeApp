import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import { DataserviceService } from '../../../../services/dataservice.service';


@Component({
  selector: 'app-userpost',
  templateUrl: './userpost.component.html',
  styleUrls: ['./userpost.component.scss']
})
export class UserpostComponent {
  constructor(
    public dialogRef: MatDialogRef<UserpostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataserviceService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
  
  toggleLike(post: any): void {
    this.ds.likePost(post.id).subscribe(
      (response) => {
        post.liked_by_user = response.liked;
      },
      (error) => {
        console.error('Error liking/unliking post:', error);
      }
    );
  }
}
