import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminDataService } from '../../../services/admin-data.service';
import { Chart } from 'chart.js/auto';
import { MatPaginator } from '@angular/material/paginator';
import { DisplayImagesComponent } from '../display-images/display-images.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumnOldest: string[] = ['fullName', 'title', 'status', 'date'];
  displayedColumnReport1: string[] = ['fullName', 'total likes', 'total post', 'action'];
  displayedColumnReport2: string[] = ['fullName', 'liked title', 'likes', 'badge'];

  dataSource!: MatTableDataSource<any>;  // or MatTableDataSource<TableElement>
  oldestpending: any = null;
  pendingPostsCount: number = 0;
  totalPostsCount: number = 0;
  DeclinedCount: number = 0;
  users: number = 0;

  reports: MatTableDataSource<any> = new MatTableDataSource();
  liked: MatTableDataSource<any> = new MatTableDataSource();

  pieChart1: any;
  pieChart2: any;
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
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef  // Inject ChangeDetectorRef
  ) {
    
  }

  inputPhotos() {
      if (this.dialog) {
        this.dialog.open(DisplayImagesComponent)
      } else {
        console.error('Uploading form not found');
      }
    }

  ngOnInit(): void {
    this.getOldest();
    this.getPendingPostsCount();
    this.getPostsCount();
    this.getDeclinedCount();
    this.getTotalUsers();
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

        this.renderPieChart();
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
  
  renderPieChart(): void {
    const ctx = document.getElementById('pieChart1') as HTMLCanvasElement;

    if (this.pieChart1) {
      this.pieChart1.destroy();
    }

    this.pieChart1 = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.userNames,
        datasets: [
          {
            label: 'Total Posts Per User',
            data: this.postCounts,  
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#FF9F40'], 
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'] 
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const value = tooltipItem.raw || 0;
                return `${tooltipItem.label}: ${value} Posts`; 
              }
            }
          }
        }
      }
    });
  }

  renderPieChart1(titles: string[], likesCount: number[]): void {

    const ctx = document.getElementById('pieChart2') as HTMLCanvasElement;
  
    if (this.pieChart2) {
      this.pieChart2.destroy(); 
    }
  
    this.pieChart2 = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: titles,  
        datasets: [
          {
            label: 'Likes Per Post',  
            data: likesCount, 
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#FF9F40'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'] 
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                const value = tooltipItem.raw || 0;
                return `${tooltipItem.label}: ${value} Likes`; // Show likes count in the tooltip
              }
            }
          }
        }
      }
    });
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
  
        this.renderPieChart1(this.title, this.likesCount);
        
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

  getOldest(): void {
    this.AS.getOldest().subscribe(
      (response) => {
  
        if (response && response.posts) {
          const posts = response.posts;  
    
          posts.forEach((post: { user_name: any; }) => {
            if (post.user_name) {
              
            } else {
              console.log('User name is missing or not found');
            }
          });
  
          this.oldestpending = posts.slice(0, 2);
  
          this.dataSource = new MatTableDataSource(this.oldestpending);
        } else {
          console.error('Error: posts data is not found in the response');
        }
  
        this.cdr.detectChanges();  
      },
      (error) => {
        console.error('Error fetching oldest pending posts', error);
      }
    );
  }
  
  getPendingPostsCount(): void {
    this.AS.TotalPendingPosts().subscribe(
      (response) => {
        this.pendingPostsCount = response['Pending posts of resit'];
        this.cdr.detectChanges();  // Trigger change detection after updating the value
      },
      (error) => {
        console.error('Error fetching pending posts count', error);
      }
    );
  }

  getPostsCount(): void {
    this.AS.TotalPosts().subscribe(
      (response) => {
        this.totalPostsCount = response['Total posts of resit'];
        this.cdr.detectChanges();  // Trigger change detection after updating the value
      },
      (error) => {
        console.error('Error fetching total posts count', error);
      }
    );
  }

  getDeclinedCount(): void {
    this.AS.TotalDeclinedPosts().subscribe(
      (response) => {
        this.DeclinedCount = response['Declined posts of resit'];
        this.cdr.detectChanges();  // Trigger change detection after updating the value
      },
      (error) => {
        console.error('Error fetching declined posts count', error);
      }
    );
  }

  getTotalUsers(): void {
    this.AS.TotalUsers().subscribe(
      (response) => {
        this.users = response['Total users of resit app'];
        this.cdr.detectChanges();  // Trigger change detection after updating the value
      },
      (error) => {
        console.error('Error fetching total users count', error);
      }
    );
  }
}

// Sample data
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


