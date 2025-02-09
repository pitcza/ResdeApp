import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminDataService } from '../../../services/admin-data.service';
import { Chart } from 'chart.js/auto';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';  // Import XLSX

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  displayedColumnReport: string[] = ['category', 'total posts'];
  displayedColumnReport1: string[] = ['fullName', 'total likes', 'total post', 'action'];
  displayedColumnReport2: string[] = ['fullName', 'liked title', 'likes', 'badge'];
  DataSource: MatTableDataSource<TableElement> = new MatTableDataSource();

  // dataSource!: MatTableDataSource<any>;

  previewData: any[] = [];
  previewVisible = false;

  reports: MatTableDataSource<any> = new MatTableDataSource();
  liked: MatTableDataSource<any> = new MatTableDataSource();
  // category: MatTableDataSource<any> = new MatTableDataSource();
  category = new MatTableDataSource<any>();

  errorMessage: string = '';

  userNames: string[] = [];  // To store user names
  postCounts: number[] = [];  // To store post counts
  title: any;
  likesCount: any;

  fromDate: string = '';  
  toDate: string = '';    

  startDate: string ='';  // Store the start date
  endDate: string ='';

  // start_date: string | null = null;
  // end_date: string | null = null;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;

  selectedFilter: string = '';  // Holds the selected filter value
  filterOptions: { label: string, value: string }[] = [
    { label: 'All Users', value: 'all' },
    { label: 'Top Posts', value: 'topPosts' },
    { label: 'Most Likes', value: 'mostLikes' },
  ];

  constructor(
    private AS: AdminDataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getUserTotalPost(); 
    this.getUserTotalPosts(); 
    this.likedpost();
    this.likedposttable();
    this.getCategories(); // Fetch initial data
  }

  ngAfterViewInit(): void {
    if (this.category) {
      this.category.paginator = this.paginator;
    }
    if (this.reports) {
      this.reports.paginator = this.paginator1;
    }
    if (this.liked) {
      this.liked.paginator = this.paginator2;
    }
    this.cdr.detectChanges();
  }

  getCategories(): void {
    this.AS
      .tableCategories(this.fromDate, this.toDate)
      .subscribe((data) => {
        // Sort the data in descending order based on total_posts
        data.sort((a: any, b: any) => b.total_posts - a.total_posts);

        this.category.data = data;
        if (this.paginator) {
          this.category.paginator = this.paginator;
        }
      });
}



  getUserTotalPost(): void {
    this.AS.userTotalPost().subscribe(
      (response) => {
        this.reports = new MatTableDataSource();
        const userData = response['users'].map((user: any) => ({
          user_name: user.user_name,
          total_likes: user.total_likes,
          total_posts: user.total_posts,
        }));
        this.reports.data = userData;
        this.userNames = userData.map((user: any) => user.user_name);
        this.postCounts = userData.map((user: any) => user.total_posts);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching total posts per user', error);
      }
    );
  }

  getUserTotalPosts(): void {
    this.AS.userTotalPosts().subscribe(
      (response) => {
        this.reports = new MatTableDataSource();
        const userData = response['users']
          .map((user: any) => ({
            user_name: user.user_name,
            total_likes: user.total_likes,
            total_posts: user.total_posts,
            badges: user.badges
          }))
          .sort((a: any, b: any) => b.total_posts - a.total_posts);
        this.reports.data = userData;
        if (this.paginator) {
          this.reports.paginator = this.paginator1;
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching total posts per user', error);
      }
    );
  }

  likedpost(): void {
    this.AS.likedpost().subscribe(
      (response) => {
        this.liked = new MatTableDataSource();
        const posts = response['posts'] || []; 
        this.title = [];
        this.likesCount = [];
        for (let i = 0; i < posts.length; i++) {
          const post = posts[i];
          this.liked.data.push({
            post_id: post.post_id,
            title: post.title,
            user_name: post.user_name,
            likes_count: post.likes_count,
            created_at: post.created_at
          });
          this.title.push(post.title);
          this.likesCount.push(post.likes_count);
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching liked posts', error);
      }
    );
  }

  likedposttable(): void {
    this.AS.likedposttable().subscribe(
      (response) => {
        const posts = response['posts'] || [];
        this.liked.data = posts.map((post: any) => ({
          post_id: post.post_id,
          title: post.title,
          user_name: post.user_name,
          likes_count: post.likes_count,
          created_at: post.created_at,
          badge: post.badge || 'N/A'
        }));
        this.liked.paginator = this.paginator2;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching posts for table and chart', error);
      }
    );
  }

  filterPosts() {
    this.category.data = this.category.data.filter(post => {
        const postDate = post.created_at ? new Date(post.created_at) : null;

        if (postDate && isNaN(postDate.getTime())) {
            console.error(`Invalid post date: ${post.created_at}`);
            return false; // Exclude invalid dates
        }

        const fromDate = this.fromDate ? new Date(this.fromDate) : null;
        const toDate = this.toDate ? new Date(this.toDate) : null;

        if (fromDate && isNaN(fromDate.getTime())) {
            console.error(`Invalid fromDate: ${this.fromDate}`);
            return false;
        }

        if (toDate && isNaN(toDate.getTime())) {
            console.error(`Invalid toDate: ${this.toDate}`);
            return false;
        }

        const fromDateMatch = fromDate ? postDate && postDate >= fromDate : true;
        const toDateMatch = toDate ? postDate && postDate <= toDate : true;

        return fromDateMatch && toDateMatch;
    });

    this.cdr.detectChanges();
}


filterCategories(): void {
  const category = this.category.data || []; 
  const filteredData = category.filter((category) => {
      const categoryDate = category.created_at ? new Date(category.created_at) : null;

      const fromDateMatch = this.fromDate
          ? categoryDate && categoryDate >= new Date(this.fromDate)
          : true;

      const toDateMatch = this.toDate
          ? categoryDate && categoryDate <= new Date(this.toDate)
          : true;

      return fromDateMatch && toDateMatch;
  });

  this.category.data = filteredData; // Update the filtered data
  this.cdr.detectChanges(); // Refresh the UI
}



onDateChange(event: Event, type: 'from' | 'to'): void {
  const input = event.target as HTMLInputElement;
  if (type === 'from') {
    this.fromDate = input.value;
  } else if (type === 'to') {
    this.toDate = input.value;
  }
  this.getCategories(); // Fetch filtered data whenever the date changes
}

  togglePreview(): void {
    this.previewVisible = !this.previewVisible;
    this.previewData = this.reports.data;
  }

  exportToExcel(): void {
    // Make sure category data exists before exporting
    if (this.category && this.category.data) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.category.data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reports');
      XLSX.writeFile(wb, 'Barangay Gordon Heights Most Talked About.xlsx');
    } else {
      console.error('No category data available for export');
    }
  }

  exportToExcel1(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.reports.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'ActiveUsers.xlsx');
  }

  exportToExcel2(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.liked.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reports');
    XLSX.writeFile(wb, 'MostLiked.xlsx');
  }
}


export interface TableElement {
  title: string;
  status: string;
  created_at?: string;
  user_name?: string;

  total_posts: string;
  total_likes: string;

  likes_count: string;
  badges: string;

  category: string;
  total: string;
}