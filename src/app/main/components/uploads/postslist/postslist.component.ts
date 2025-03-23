import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';
import { Router } from '@angular/router';
import { UploadPostComponent } from '../../upload-post/upload-post.component';
import { MatDialog } from '@angular/material/dialog';
import { EditpostComponent } from '../editpost/editpost.component';
import { ViewComponent } from '../view/view.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-postslist',
  templateUrl: './postslist.component.html',
  styleUrl: './postslist.component.scss'
})
export class PostslistComponent implements OnInit {
  @ViewChildren('videoElement') videoElements!: QueryList<ElementRef>;
  
  captureFirstFrame(video: HTMLVideoElement, element: any) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    video.currentTime = 0.1; // Seek to a very early frame
    video.addEventListener('seeked', function onSeeked() {
      video.removeEventListener('seeked', onSeeked); // Remove listener after execution

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      element.previewImage = canvas.toDataURL('image/png'); // Save first frame as poster
    });
  }
  
  displayedColumns: string[] = ['image', 'date', 'category', 'title', 'status', 'action'];
  filteredDataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  dataSource: any [] = [];
  categoryFilter: string = '';
  fromDate: string = '';
  toDate: string = '';
  id: any|string;
  element: any;
  
  isLoading = true;
  loaders = Array(5).fill(null);

  filteredPosts: any[] = [];
  selectedCategory: string = '';

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 9;
  totalPages: number = 1;

  constructor (
    private ds: DataserviceService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserPost();
    this.filteredDataSource.data = this.dataSource;  
  }

  setDefaultFilter(): void {
    this.filteredPosts = [...this.dataSource];
  }

  applyFilters(): void {
    let filteredPosts = this.dataSource;

    if (this.selectedCategory) {
      filteredPosts = filteredPosts.filter(post => post.category === this.selectedCategory);
    }

    if (this.fromDate) {
      const fromDate = new Date(this.fromDate);
      filteredPosts = filteredPosts.filter(post => new Date(post.date) >= fromDate);
    }

    if (this.toDate) {
      const toDate = new Date(this.toDate);
      filteredPosts = filteredPosts.filter(post => new Date(post.date) <= toDate);
    }

    this.filteredPosts = filteredPosts;
  }

  uploadIdea() {
    const dialogRef = this.dialog.open(UploadPostComponent);
    dialogRef.afterClosed().subscribe(() => {
      this.fetchUserPost();
    });
  }

  editPost(postId: number) {
    const dialogRef = this.dialog.open(EditpostComponent, {
      data: { id: postId }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.fetchUserPost();
    });
  }

  viewPost(id: number) {
    const dialogRef = this.dialog.open(ViewComponent, {
      data: { id: id }  
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.fetchUserPost();
    });
  }

  fetchUserPost(): void {
    this.ds.getUserPosts().subscribe(
      (response) => {
        this.dataSource = response.posts
          .map((post: any) => ({
            id: post.id,
            title: post.title,
            category: post.category,
            date: post.created_at,
            image: post.image,
            image_type: post.image_type,
            status: post.status,
            description: post.content,
            total_likes: post.total_likes
          }))
          .sort((a: { date: string | undefined }, b: { date: string | undefined }) => {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateB - dateA;
          });

        this.applyFilters();
        this.isLoading = false;
        this.cdr.detectChanges();
        this.filterPosts();

        console.log(response);
        this.isLoading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  filterPosts() {
    let filteredData = this.dataSource;

    if (this.categoryFilter) {
      filteredData = filteredData.filter(post => post.category?.toLowerCase() === this.categoryFilter.toLowerCase());
    }

    if (this.fromDate) {
      const fromDate = new Date(this.fromDate);
      filteredData = filteredData.filter(post => new Date(post.date) >= fromDate);
    }

    if (this.toDate) {
      const toDate = new Date(this.toDate);
      filteredData = filteredData.filter(post => new Date(post.date) <= toDate);
    }

    this.filteredPosts = filteredData;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPosts.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
    this.filteredDataSource.data = this.paginateData();
  }

  paginateData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredPosts.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filteredDataSource.data = this.paginateData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filteredDataSource.data = this.paginateData();
    }
  }
  
  onCategoryChange(event: any) {
    this.categoryFilter = event.target.value;
    this.filterPosts();
  }
  
  onDateChange(event: any, type: string) {
    const selectedDate = event.target.value;
    if (type === 'from') {
      this.fromDate = selectedDate;
    } else if (type === 'to') {
      this.toDate = selectedDate;
    }
  
    this.filterPosts(); 
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../../../assets/images/NoImage.png';
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
            this.dataSource = this.dataSource.filter(post => post.id !== id);
            this.filteredDataSource.data = this.filteredDataSource.data.filter(post => post.id !== id);
            this.cdr.detectChanges();
    
            Swal.fire({
              title: 'Post Deleted!',
              text: 'The post has been deleted.',
              icon: 'success',
              confirmButtonText: 'Close',
              confirmButtonColor: '#7f7f7f',
              timer: 5000,
              scrollbarPadding: false
            }).then(() => {
              this.fetchUserPost();
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


export interface TableElement {
  image: string;
  image_type?: string;
  previewImage?: string;
  created_at?: string;
  category?: string;
  title: string;
  status?: string;
  id: number;
  date: number;
  total_likes?: number;
}