import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

import { DataserviceService } from '../../../../services/dataservice.service';


@Component({
  selector: 'app-userpost',
  templateUrl: './userpost.component.html',
  styleUrls: ['./userpost.component.scss']
})
export class UserpostComponent {
  post: any;
  postId!: number;

  constructor(
    public dialogRef: MatDialogRef<UserpostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataserviceService
  ) {
    this.postId = data?.id;
  }

  ngOnInit(): void {
    this.fetchPost();
  }

  fetchPost(): void {
    this.ds.getPost(this.postId).subscribe(
      (response) => {
        this.post = response;
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

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
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
