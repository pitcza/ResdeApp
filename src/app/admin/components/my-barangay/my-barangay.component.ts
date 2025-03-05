import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CreatePostComponent } from './create-post/create-post.component';
import { AdminDataService } from '../../../services/admin-data.service';

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
}
