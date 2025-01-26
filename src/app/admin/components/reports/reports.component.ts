
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminDataService } from '../../../services/admin-data.service';
import { Chart } from 'chart.js/auto';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  displayedColumnReport1: string[] = ['fullName', 'total likes', 'total post', 'action'];
  displayedColumnReport2: string[] = ['fullName', 'liked title', 'likes', 'badge'];

  dataSource!: MatTableDataSource<any>;

  reports: MatTableDataSource<any> = new MatTableDataSource();
  liked: MatTableDataSource<any> = new MatTableDataSource();

  userNames: string[] = [];  // To store user names
  postCounts: number[] = [];  // To store post counts
  title: any;
  likesCount: any;

  fromDate: string = '';  // For the "from" date
  toDate: string = '';    // For the "to" date

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
    private cdr: ChangeDetectorRef  // Inject ChangeDetectorRef
  ) {
    
  }

  ngOnInit(): void {
    this.getUserTotalPost(); 
    this.getUserTotalPosts(); 
    this.likedpost();
    this.likedposttable();
  }

  ngAfterViewInit(): void {
    // Ensure that the paginator is assigned after the data is loaded
    if (this.reports && this.paginator) {
      this.reports.paginator = this.paginator;
    }
    if (this.liked && this.paginator) {
      this.liked.paginator = this.paginator;
    }
    
    // Detect changes after paginator assignment
    this.cdr.detectChanges();
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
            console.error('Error fetching total posts per user', error);
          }
        );
      }
    
      likedposttable(): void {
        this.AS.likedposttable().subscribe(
          (response) => {
            this.liked = new MatTableDataSource();
            console.log(response)
      
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
      
          // Ensure valid date comparisons
          const fromDateMatch = this.fromDate
            ? postDate && postDate >= new Date(this.fromDate)
            : true;
          const toDateMatch = this.toDate
            ? postDate && postDate <= new Date(this.toDate)
            : true;
      
          return fromDateMatch && toDateMatch;
        });
      
        this.reports.data = filteredPosts;
        this.cdr.detectChanges();
      }
      
    
      filterLikes(): void {
        const sourceData = this.liked.data || [];
      
        const filteredPosts = sourceData.filter(post => {
          const postDate = post.created_at ? new Date(post.created_at) : null;
      
          // Ensure valid date comparisons
          const fromDateMatch = this.fromDate
            ? postDate && postDate >= new Date(this.fromDate)
            : true;
          const toDateMatch = this.toDate
            ? postDate && postDate <= new Date(this.toDate)
            : true;
      
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
}