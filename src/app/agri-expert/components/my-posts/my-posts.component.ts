import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DataserviceService } from '../../../services/dataservice.service';
import { AgrieditComponent } from './agriedit/agriedit.component';
import { UploadComponent } from './upload/upload.component';
import { ViewMypostComponent } from './view-mypost/view-mypost.component';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.scss'
})
export class MyPostsComponent implements OnInit {
  displayedColumns: string[] = ['date', 'category', 'materials', 'title', 'action'];
  dataSource: any [] = [];
  id: any|string;
  element: any;
  
  isLoading = true;
  
  constructor (
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ds: DataserviceService
  ) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.ds.getUserPosts().subscribe(
      (response) => {
        this.dataSource = response.posts
        .map((post: any) => ({
          id: post.id,
          title: post.title,
          category: post.category,
          materials: post.materials,
          date: post.created_at,
          image: post.image,
          status: post.status,
          description: post.content
        }))
        .sort((a: { date: string | undefined }, b: { date: string | undefined }) => {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return dateB - dateA; // Sort in descending order (newest first)
        });
        console.log(response)
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  // VIEWING POST POPUP
  viewPost(id: number, context: string) {
    if (this.dialog) {
      this.dialog.open(ViewMypostComponent, {
        data: { id: id, context: context }
      });
    } else {
      console.error('View popup not found');
    }
  }

  uploadIdea() {
    const dialogRef = this.dialog.open(UploadComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.fetchPosts();
    });
  }

  editPost(id: number) {
    const dialogRef = this.dialog.open(AgrieditComponent, {
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchPosts();
    });
  }

  // DELETE PROCESS
  deletePost(id: number) {
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
            // Remove the deleted post from dataSource
            this.dataSource = this.dataSource.filter(post => post.id !== id);
            this.cdr.detectChanges();

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
        return Array.isArray(parsedMaterials) ? parsedMaterials.join(', ') : 'No materials listed';
    } catch {
        return 'No materials listed';
    }
  }
}


export interface TableElement {
  image: string;
  created_at?: string;
  category?: string;
  title: string;
  status?: string;
  id: number;
}