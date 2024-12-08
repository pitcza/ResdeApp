import { Component, OnInit, HostListener } from '@angular/core';
import { DataserviceService } from '../../../services/dataservice.service';
import { UserpostComponent } from './userpost/userpost.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewAnnouncemComponent } from './view-announcem/view-announcem.component';
import { UploadPostComponent } from '../upload-post/upload-post.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {

  posts: any[] = [];
  isLoading = true;
  loaders = Array(5).fill(null);

  filteredPosts: any[] = [];

  constructor(private ds: DataserviceService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  isExpanded = false;

  toggleCards() {
    this.isExpanded = !this.isExpanded;
  }

  upEventContainer = false;
  downUploadIcon = false
  lastScrollTop = 0;
  scrollThreshold = 10;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (Math.abs(this.lastScrollTop - currentScrollTop) <= this.scrollThreshold) {
      return; // Ignore small scrolls
    }

    if (currentScrollTop > this.lastScrollTop) {
      // Scrolling down
      this.upEventContainer = true;
      this.downUploadIcon = true;
    } else {
      // Scrolling up
      this.upEventContainer = false;
      this.downUploadIcon = false;
    }

    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }

  viewPost(postId: number) {
    // Fetch post data using postId (this could be an API call)
    const selectedPost = this.posts.find(post => post.id === postId);

    if (selectedPost) {
      this.dialog.open(UserpostComponent, {
        data: selectedPost  // Passing the selected post data to the dialog
      });
    } else {
      console.error('Post not found');
    }
  }

  viewAnnouncem() {
    if (this.dialog) {
      this.dialog.open(ViewAnnouncemComponent)
    } else {
      console.error('Announcement not found');
    }
  }

  // UPLOADING POPUP
  uploadIdea() {
    if (this.dialog) {
      this.dialog.open(UploadPostComponent)
    } else {
      console.error('Uploading form not found');
    }
  }

  loadPosts(): void {
    this.ds.getAllPosts().subscribe(
      (response) => {
        this.posts = response.posts || [];
        this.filteredPosts = this.posts;
        this.isLoading = false; // Turn off loading state
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false; // Turn off loading state even on error
      }
    );
  }

  filterPosts(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
  
    if (selectElement) {
      const selectedCategory = selectElement.value;
  
      if (selectedCategory === '') {
        this.filteredPosts = this.posts;  // Show all posts if "All Category" is selected
      } else {
        this.filteredPosts = this.posts.filter(post => post.category === selectedCategory);
      }
    }
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
