import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
  id!: number;
  post: any;

  constructor(
    public dialogRef: MatDialogRef<ViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private router: Router,
    private ds: DataserviceService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.id = data?.id;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.fetchPost();
  }

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }
  
  fetchPost(): void {
    this.ds.getPost(this.id).subscribe(
      (response) => {
        this.post = response;

        if (typeof this.post.report_reasons === 'string') {
          this.post.report_reasons = JSON.parse(this.post.report_reasons);
        }
      },
      (error) => {
        console.error('Error fetching post:', error);
      }
    );
  }

  getUniqueReasons(): string[] {
    return Array.from(new Set(this.post.report_reasons));
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

  deletePost(id: number, dialogRef: any) {
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
        this.ds.deletePost(id).subscribe(
          () => {
            this.cdr.detectChanges();
  
            // Navigate to the post list after deletion
            this.router.navigate(['main/uploads/postlist']);
  
            // Close the dialog after deleting the post
            if (dialogRef) {
              dialogRef.close();
            }
  
            Swal.fire({
              title: 'Post Deleted!',
              text: 'The post has been deleted.',
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: '#7f7f7f',
              timer: 5000,
              scrollbarPadding: false
            });
          },
          error => {
            console.error('Error deleting post:', error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error deleting the post.',
              icon: 'error',
              confirmButtonText: 'Close',
              confirmButtonColor: '#7f7f7f',
              timer: 5000,
              scrollbarPadding: false
            });
          }
        );
      }
    });
  }
  
  
}
