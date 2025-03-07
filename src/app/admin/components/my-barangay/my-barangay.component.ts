import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CreatePostComponent } from './create-post/create-post.component';
import { AdminDataService } from '../../../services/admin-data.service';

import Swal from 'sweetalert2';
import { ViewPostComponent } from './view-post/view-post.component';
import { EditPostComponent } from './edit-post/edit-post.component';

@Component({
  selector: 'app-my-barangay',
  templateUrl: './my-barangay.component.html',
  styleUrls: ['./my-barangay.component.scss']
})
export class MyBarangayComponent implements OnInit, OnDestroy {
  barangayPosts: any[] = []; // Store posts here
  isLoading: boolean = true; // Loading state
  private routerSubscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private adminService: AdminDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchBarangayPosts(); // Initial fetch

    // ✅ Detect when the user navigates back to this tab
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.fetchBarangayPosts();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Fetch All Barangay Posts
  fetchBarangayPosts() {
    this.isLoading = true; // Show skeleton loader
    this.adminService.getBarangayPosts().subscribe(
      (posts) => {
        this.barangayPosts = posts;
        this.isLoading = false; // Hide skeleton loader
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  createPost() {
    const dialogRef = this.dialog.open(CreatePostComponent);

    // Refresh posts after creating a new one
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchBarangayPosts();
      }
    });
  }

  viewPost(id: number) {
    const dialogRef = this.dialog.open(ViewPostComponent, {
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchBarangayPosts();
      }
    });
  }

  editPost(id: number) {
    const dialogRef = this.dialog.open(EditPostComponent, {
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchBarangayPosts();
      }
    });
  }

  // Delete Post
  deletePost(postId: number) {
    Swal.fire({
      title: 'Delete Post',
      text: 'Are you sure you want to delete this post? This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#cc4646',
      cancelButtonColor: '#7f7f7f',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteBarangayPost(postId).subscribe(
          () => {
            this.barangayPosts = this.barangayPosts.filter(post => post.id !== postId);
            this.fetchBarangayPosts();
            Swal.fire('Deleted!', 'The post has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting post:', error);
            Swal.fire('Error', 'Failed to delete the post.', 'error');
          }
        );
      }
    });
  }

  // dropdown
  menuVisiblePostId: number | null = null; // Track which post's menu is open

  toggleMenu(event: Event, postId: number) {
    event.stopPropagation(); // Prevent auto-closing immediately
    this.menuVisiblePostId = this.menuVisiblePostId === postId ? null : postId;
  }

  @HostListener('document:click')
  closeMenu() {
    this.menuVisiblePostId = null;
  }

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }

  filteredPosts: any[] = []; // Posts after search/filter
  searchText: string = ''; // Search text
  currentPage = 1;
  itemsPerPage = 10;

  applyFilters(): void {
    this.filteredPosts = this.barangayPosts.filter(post =>
      post.caption.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.currentPage = 1; // Reset to first page on new search
    this.cdr.detectChanges(); // Ensure UI updates
  }

  // Pagination Logic
  get paginatedPosts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPosts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
