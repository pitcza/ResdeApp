import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DataserviceService } from '../../../../services/dataservice.service';

@Component({
  selector: 'app-userpost',
  templateUrl: './userpost.component.html',
  styleUrls: ['./userpost.component.scss']
})
export class UserpostComponent implements OnInit {
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
    public dialogRef: MatDialogRef<UserpostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private ds: DataserviceService,
  ) {
    this.id = data?.id;
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

  toggleLike(post: any) {
    this.ds.toggleLike(post.id).subscribe(
      (response: any) => {
        post.liked_by_user = !post.liked_by_user; // Toggle UI state
        post.total_likes = response.total_likes; // Update total likes dynamically
      },
      (error) => {
        console.error('Error toggling like:', error);
      }
    );
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
  
  closeDialog() {
    this.dialogRef.close();
  }
}
