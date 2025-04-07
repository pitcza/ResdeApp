import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { AdminDataService } from '../../../../services/admin-data.service';
import { DataserviceService } from '../../../../services/dataservice.service';

@Component({
  selector: 'app-view-mypost',
  templateUrl: './view-mypost.component.html',
  styleUrl: './view-mypost.component.scss'
})
export class ViewMypostComponent implements OnInit{
  id!: number;
  post: any;

  constructor(
    private as: AdminDataService,
    public dialogRef: MatDialogRef<ViewMypostComponent>,
    private ds: DataserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.fetchPostDetails();
  }

  closeDialog() {
    this.dialogRef.close();
  }

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

  fetchPostDetails(): void {
    this.as.getPostById(this.id).subscribe(
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

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../../../assets/images/NoImage.png';
  }

  formatMaterials(materials: string): string {
    try {
        const parsedMaterials = JSON.parse(materials);
        return Array.isArray(parsedMaterials) ? parsedMaterials.join(', ') : 'No materials listed.';
    } catch {
        return 'No materials listed.';
    }
  }

  getUniqueReasons(): string[] {
    return Array.from(new Set(this.post.report_reasons));
  }

  deletePost(id: number): void {
    Swal.fire({
      title: 'Delete Post',
      text: 'Are you sure you want to delete your post? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#CC4646',
      cancelButtonColor: '#7F7F7F',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Send delete request without remarks
        this.ds.deletePost(id).subscribe({
          next: (response) => {
            Swal.fire('Deleted!', 'Your post has been permanently deleted.', 'success');
            this.closeDialog();
          },
          error: (error) => {
            Swal.fire('Error!', 'Failed to delete post. Please try again.', 'error');
          }
        });
      }
    });
  }
}