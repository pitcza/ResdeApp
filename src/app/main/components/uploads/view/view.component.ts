import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  @ViewChildren('videoElement') videoElements!: QueryList<ElementRef>;
  
  captureFirstFrame(video: HTMLVideoElement, post: any) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    video.currentTime = 0.1;
    video.addEventListener('seeked', function onSeeked() {
      video.removeEventListener('seeked', onSeeked);

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      post.previewImage = canvas.toDataURL('image/png');
    });
  }

  post: any;
  id!: number;

  constructor(
    public dialogRef: MatDialogRef<ViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private ds: DataserviceService,
    private cdr: ChangeDetectorRef,
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

  editPost(postId: number) {
    const dialogRef = this.dialog.open(EditpostComponent, {
      data: { id: postId }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchPost();
    });
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
            this.closeDialog();
            this.fetchPost();
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
  
  formatMaterials(materials: string): string {
    try {
        const parsedMaterials = JSON.parse(materials);
        return Array.isArray(parsedMaterials) ? parsedMaterials.join(', ') : 'No materials listed.';
    } catch {
        return 'No materials listed.';
    }
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../../../assets/images/NoImage.png';
  }
}
