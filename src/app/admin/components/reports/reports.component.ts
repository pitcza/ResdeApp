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

  dataSource!: MatTableDataSource<any>;

  previewData: any[] = [];
  previewVisible = false;

  reports: MatTableDataSource<any> = new MatTableDataSource();
  liked: MatTableDataSource<any> = new MatTableDataSource();
  category: MatTableDataSource<any> = new MatTableDataSource();

  errorMessage: string = '';

  userNames: string[] = [];  // To store user names
  postCounts: number[] = [];  // To store post counts
  title: any;
  likesCount: any;

  fromDate: string = '';  
  toDate: string = '';    

  start_date: string ='';  // Store the start date
  end_date: string ='';

  filteredDataSource: TableElement[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    this.getCategoriesData();
  }

  ngAfterViewInit(): void {
    if (this.reports && this.paginator) {
      this.reports.paginator = this.paginator;
    }
    if (this.liked && this.paginator) {
      this.liked.paginator = this.paginator;
    }
    this.cdr.detectChanges();
  }

  getCategoriesData(): void {
    this.AS.tableCategories({ start_date: this.start_date, end_date: this.end_date })
      .subscribe(
        (data) => {
          this.category.data = data;
          console.log('Filtered Categories Data:', data);
  
          // After successfully fetching data, call exportToExcel
          this.exportToExcel();
        },
        (error) => {
          this.errorMessage = 'Error fetching categories data';
          console.error(error);
        }
      );
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
          this.reports.paginator = this.paginator;
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
            created_at: post.created_at,
            badge1: post.badge
          });
          this.title.push(post.title);
          this.likesCount.push(post.likes_count);
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching posts for table and chart', error);
      }
    );
  }

  filterPosts(): void {
    const reports = this.reports.data || [];
    const filteredPosts = reports.filter(post => {
      const postDate = post.created_at ? new Date(post.created_at) : null;
      const fromDateMatch = this.fromDate ? postDate && postDate >= new Date(this.fromDate) : true;
      const toDateMatch = this.toDate ? postDate && postDate <= new Date(this.toDate) : true;
      return fromDateMatch && toDateMatch;
    });
    this.reports.data = filteredPosts;
    this.cdr.detectChanges();
  }

  filterLikes(): void {
    const sourceData = this.liked.data || [];
    const filteredPosts = sourceData.filter(post => {
      const postDate = post.created_at ? new Date(post.created_at) : null;
      const fromDateMatch = this.fromDate ? postDate && postDate >= new Date(this.fromDate) : true;
      const toDateMatch = this.toDate ? postDate && postDate <= new Date(this.toDate) : true;
      return fromDateMatch && toDateMatch;
    });
    this.liked.data = filteredPosts;
    this.cdr.detectChanges();
  }

  onDateChange(event: any, type: string) {
    const selectedDate = event.target.value;
    if (type === 'from') {
      this.fromDate = selectedDate;
    } else if (type === 'to') {
      this.toDate = selectedDate;
    }
    this.filterPosts();
    this.filterLikes();
    this.getCategoriesData();
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