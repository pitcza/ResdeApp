import { Component, OnInit, HostListener, ChangeDetectorRef, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataserviceService } from '../../../services/dataservice.service';
import { ViewAnnouncemComponent } from './view-announcem/view-announcem.component';
import { UserpostComponent } from './userpost/userpost.component';
import { UploadPostComponent } from '../upload-post/upload-post.component';
import { EditpostComponent } from '../uploads/editpost/editpost.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
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

  posts: any[] = [];
  isLoading = true;
  loaders = Array(5).fill(null);
  announcements: any[] = [];
  // announcement: MatTableDataSource<TableElement> = new MatTableDataSource(this.announcements);

  filteredPosts: any[] = [];
  searchText: string = '';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private ds: DataserviceService, 
    private dialog: MatDialog, 
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadAnnouncements();
    this.getLoggedInUser();
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
    if (postId) {
      this.dialog.open(UserpostComponent, {
        data: { id: postId }  // Ensure `id` is correctly assigned
      });
    } else {
      console.error('Invalid postId:', postId);
    }
  }  

  loadAnnouncements(): void {
    this.ds.getannouncement().subscribe(
        (response) => {
            // console.log('Fetched announcements:', response);  
            this.announcements = response || [];
            this.announcements.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            console.log(response)
        },
        (error) => {
            console.error('Error fetching announcements:', error);
        }
    );
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../assets/images/NoImage.png';
  }

  viewAnnouncem(id: number) {
    const announcementPost = this.announcements.find(announcement => announcement.id === id); // Correct comparison

    if (announcementPost) {
        this.dialog.open(ViewAnnouncemComponent, {
          data: announcementPost
        });
    } else {
        console.error('Announcement not found');
    }
  }

  uploadIdea() {
    if (this.dialog) {
      this.dialog.open(UploadPostComponent)
    } else {
      console.error('Uploading form not found');
    }
  }

  editPost(id: number) {
    if (this.dialog) {
      this.dialog.open(EditpostComponent, {
        data: { id: id }
      });
    } else {
      console.error('not found');
    }
  }

  loadPosts(): void {
    this.ds.getAllPosts().subscribe(
      (response) => {
        console.log("API Response:", response); // Debugging

      if (response && typeof response === 'object') {
        this.posts = Object.values(response); // Convert object to array
      } else {
        console.error("Unexpected API response format:", response);
        this.posts = [];
      }

      this.filteredPosts = [...this.posts];
      this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

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

  filterPosts(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCategory = selectElement.value;
    console.log('Selected Category:', selectedCategory); // Debugging log
  
    if (selectedCategory === '') {
      this.filteredPosts = [...this.posts];
    } else {
      this.filteredPosts = this.posts.filter(post =>
        post.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );
    }
  
    this.currentPage = 1;
    console.log('Filtered Posts:', this.filteredPosts); // Debugging log
  }

  applyFilters(): void {
    let filteredData = this.posts;
  
    if (this.searchText) {
      filteredData = filteredData.filter(post =>
        post.content.toLowerCase().includes(this.searchText.toLowerCase()) ||
        post.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        post.category.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  
    this.filteredPosts = filteredData;
    this.cdr.detectChanges();
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

  // report and delete 
  loggedInUserId: number = 0;

  getLoggedInUser() {
    this.ds.getUser().subscribe((user) => {
      this.loggedInUserId = user.id;  // Store user ID
    });
  }

  deletePost(postId: number) {
    Swal.fire({
      title: 'Delete your Post',
      text: 'Are you suer you want to delete your post? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.deletePost(postId).subscribe(() => {
          this.filteredPosts = this.filteredPosts.filter(post => post.id !== postId);
          Swal.fire(
            'Deleted!',
            'Your post has been deleted.',
            'success'
          );
        }, (error) => {
          console.error('Error deleting post:', error);
          Swal.fire(
            'Error!',
            'Something went wrong while deleting the post.',
            'error'
          );
        });
      }
    });
  }

  // REPORTING POST
  showReportModal = false;
  selectedPostId: number | null = null;
  selectedReasons: string[] = [];

  reportReasons = [
    "Inappropriate Content",
    "Spam",
    "Unrelated to 3Rs & Gardening",
    "Unnecessary or Off-Topic Photo/Video",
    "Fake Information",
    "Unauthorized Advertisement",
    "Copyright Violation",
  ];

  openReportModal(postId: number) {
    this.selectedPostId = postId;
    this.selectedReasons = [];
    this.showReportModal = true;
  }

  closeReportModal() {
    this.showReportModal = false;
    this.selectedReasons = [];
  }

  toggleReason(reason: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      this.selectedReasons.push(reason); // Add to array if checked
    } else {
      this.selectedReasons = this.selectedReasons.filter(r => r !== reason); // Remove if unchecked
    }
  }

  submitReport() {
    if (!this.selectedPostId || this.selectedReasons.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Report Failed',
        text: 'Please select at least one reason before submitting.',
        confirmButtonColor: '#266CA9'
      });
      return;
    }

    const reportedPost = this.posts.find(post => post.id === this.selectedPostId);
    const reportedUserName = reportedPost ? reportedPost.fname : 'User';
  
    this.ds.reportPost(this.selectedPostId, { reasons: this.selectedReasons }).subscribe(
      response => {
        console.log('Post reported:', response);
        this.closeReportModal();
  
        // Success message
        Swal.fire({
          icon: 'success',
          title: 'Thanks for letting us know!',
          html: `We use your feedback to help our system learn when something's not right. <br> We will review it shortly. <br><strong>${reportedUserName}</strong>'s post is temporarily hidden for 30 days.`,
          confirmButtonColor: '#266CA9'
        });
      },
      error => {
        console.error('Error reporting post:', error);
        
        // Error message
        Swal.fire({
          icon: 'error',
          title: 'Report Failed',
          text: 'Something went wrong while submitting your report. Please try again later.',
          confirmButtonColor: '#266CA9'
        });
      }
    );
  } 
}

export interface TableElement {
  image: string;
  created_at?: string;
  category?: string;
  title: string;
  fname: string;
  lname: string;
  description: string;
  id: number;
}