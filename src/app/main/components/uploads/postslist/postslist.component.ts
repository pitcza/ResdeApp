import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  displayedColumns: string[] = ['image', 'date', 'category', 'title', 'status', 'action'];
  filteredDataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  dataSource: any [] = [];
  categoryFilter: string = '';
  statusFilter: string = '';
  fromDate: string = '';  // For the "from" date
  toDate: string = '';    // For the "to" date
  id: any|string;
  element: any;
  
  isLoading = true;
  loaders = Array(5).fill(null);

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

  // UPLOADING POPUP
  uploadIdea() {
    const dialogRef = this.dialog.open(UploadPostComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.newPost) {
        this.dataSource.unshift(result.newPost);
        this.cdr.detectChanges();  // Ensure the changes are reflected
      }
    });
  }

  // EDITING POST POPUP
  editPost(id: number) {
    if (this.dialog) {
      this.dialog.open(EditpostComponent, {
        data: { id: id }
      });
    } else {
      console.error('not found');
    }
  }

  // VIEWING POST POPUP
  viewPost(id: number) {
    if (this.dialog) {
      this.dialog.open(ViewComponent, {
        data: { id: id }  
      });
    } else {
      console.error('View popup not found');
    }
  }

  fetchUserPost(): void {
    this.ds.getUserPosts().subscribe(
      (response) => {
        // Assign the fetched posts to the dataSource
        this.dataSource = response.posts
          .map((post: any) => ({
            id: post.id,
            title: post.title,
            category: post.category,
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
  
        // Immediately filter the data after fetching
        this.filterPosts();
  
        console.log(response);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }
  

  filterPosts() {
    const selectedCategory = this.categoryFilter;
    const selectedStatus = this.statusFilter;
  
    const filteredData = this.dataSource.filter(post => {  // Use dataSource for filtering
      const categoryMatch = selectedCategory ? post.category?.toLowerCase() === selectedCategory.toLowerCase() : true;
      const statusMatch = selectedStatus ? post.status?.toLowerCase() === selectedStatus.toLowerCase() : true;
  
      // Date filter logic
      const postDate = post.created_at ? new Date(post.created_at) : null;
      const fromDateMatch = this.fromDate ? postDate && postDate >= new Date(this.fromDate) : true;
      const toDateMatch = this.toDate ? postDate && postDate <= new Date(this.toDate) : true;
  
      return categoryMatch && statusMatch && fromDateMatch && toDateMatch;
    });
  
    this.filteredDataSource.data = filteredData;  // Update filteredDataSource
    this.cdr.detectChanges();  // Ensure UI updates correctly
  }
  
  onCategoryChange(event: any) {
    this.categoryFilter = event.target.value;
    this.filterPosts();
  }
  
  onStatusChange(event: any) {
    this.statusFilter = event.target.value;
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
}


export interface TableElement {
  image: string;
  created_at?: string;
  category?: string;
  title: string;
  status?: string;
  id: number;
  date: number
}