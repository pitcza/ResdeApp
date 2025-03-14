import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminDataService } from '../../../services/admin-data.service';
import { Chart } from 'chart.js/auto';
import { MatPaginator } from '@angular/material/paginator';
import { DisplayImagesComponent } from '../forlandingphotos/display-images/display-images.component';
import { MatDialog } from '@angular/material/dialog';
import { ImagesHistoryComponent } from '../forlandingphotos/images-history/images-history.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dataSource!: MatTableDataSource<any>;  // or MatTableDataSource<TableElement>
  
  totalPosts: number = 0;
  totalReportedPosts: number = 0;
  totalBarangayPosts: number = 0;
  totalUsers: number = 0;

  barChartMaterials: any;
  materialLabels: string[] = [];
  materialCounts: number[] = [];

  barChart: any;
  mostCategoriesData: any[] = [];

  pieChart1: any;
  userNames: string[] = [];
  postCounts: number[] = [];

  pieChart2: any;
  mostLikedTitles: string[] = [];
  mostLikedCounts: number[] = [];

  constructor(
    private AS: AdminDataService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  // for landing page highlights
  inputPhotos() {
    if (this.dialog) {
      this.dialog.open(DisplayImagesComponent)
    } else {
      console.error('Uploading form not found');
    }
  }

  photosHistory() {
    if (this.dialog) {
      this.dialog.open(ImagesHistoryComponent)
    } else {
      console.error('History modal not found');
    }
  }
  // end of landing page highlights

  ngOnInit(): void {
    this.dashboardCounts();
    this.getActiveUsers();
    this.getMostLikedPosts();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getMaterialsChart();
      this.getMostCategories();
      this.getActiveUsers();
      this.getMostLikedPosts();
    });
    
    this.cdr.detectChanges();
  }

  // most talked-about issues
  getMaterialsChart(): void {
    this.AS.getMaterialsChart().subscribe(
      (response) => {
        // console.log("Materials API Response:", response);
  
        if (!response || !response.materials_data || response.materials_data.length === 0) {
          console.warn("No material data found! Displaying an empty chart.");
          this.materialLabels = [];
          this.materialCounts = [];
        } else {
          this.materialLabels = response.materials_data.map((item: any) => item.materials);
          this.materialCounts = response.materials_data.map((item: any) => item.total_posts);
        }
  
        // console.log("Labels:", this.materialLabels);
        // console.log("Counts:", this.materialCounts);
  
        this.createMaterialsBarChart();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Error fetching materials chart data:", error);
      }
    );
  }
  
  createMaterialsBarChart(): void {
    setTimeout(() => { // Ensure DOM is ready
      const canvas = document.getElementById('barChartMaterials') as HTMLCanvasElement;
      if (!canvas) {
        console.error("Canvas element 'barChartMaterials' not found!");
        return;
      }
  
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Canvas context is null!");
        return;
      }
  
      if (this.barChartMaterials) {
        this.barChartMaterials.destroy();
      }
  
      this.barChartMaterials = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.materialLabels,
          datasets: [
            {
              label: 'Total Posts Per Material',
              data: this.materialCounts,
              backgroundColor: ['#266CA9', '#FF6384', '#689F7A', '#FFCE56', '#FF9F40'],
              hoverBackgroundColor: ['#19609d', '#D54866', '#568B67', '#E0B443', '#D9832D']
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem: any) {
                  return `${tooltipItem.label}: ${tooltipItem.raw} Posts`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }, 500);
  }
  

  // most talked-about categories
  getMostCategories(): void {
    this.AS.tableCategories().subscribe(
        (data: any[]) => {
            // console.log("Categories API Response:", data);

            if (!data || data.length === 0) {
                console.warn("No category data received! Displaying empty chart.");
                this.categoriesBarChart([], []);
                return;
            }

            this.mostCategoriesData = data;
            const categories = data.map(item => item.category);
            const totalPosts = data.map(item => item.total_posts);

            this.categoriesBarChart(categories, totalPosts);
            this.cdr.detectChanges();
        },
        (error) => {
            console.error("Error fetching most categories data:", error);
        }
    );
  }

  categoriesBarChart(category: string[], total_posts: number[]): void {
    const canvas = document.getElementById('barChart1') as HTMLCanvasElement;

    if (!canvas) {
        console.error("Canvas element 'barChart1' not found!");
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error("Canvas context is null!");
        return;
    }

    if (this.barChart) {
        this.barChart.destroy();
    }

    this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: category,
            datasets: [
                {
                    label: 'Total Posts Per Category',
                    data: total_posts,
                    backgroundColor: category.map((_, i) => 
                        ['#266CA9', '#FF6384', '#689F7A', '#FFCE56', '#FF9F40'][i % 5]
                    ),
                    hoverBackgroundColor: category.map((_, i) => 
                        ['#19609d', '#D54866', '#568B67', '#E0B443', '#D9832D'][i % 5]
                    )
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Prevent sizing issues
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem: any) {
                            return `${tooltipItem.label}: ${tooltipItem.raw} Posts`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1 // Ensure integer values
                    }
                }
            }
        }
    });
  }
  
  // most active user
  getActiveUsers(): void {
    this.AS.getMostActiveUsers().subscribe(
      (response) => {
        if (response && response.users.length > 0) {
          this.userNames = response.users.map((user: ActiveUser) => user.name);
          this.postCounts = response.users.map((user: ActiveUser) => user.total_posts);
          this.activeUsersPieChart(); // Call function to update pie chart
        } else {
          console.warn('No active users found.');
          this.userNames = [];
          this.postCounts = [];
          this.activeUsersPieChart(); // Still update the chart to clear it if necessary
        }
      },
      (error) => {
        console.error('Error fetching most active users:', error);
      }
    );
  }

  activeUsersPieChart(): void {
    const ctx = document.getElementById('pieChart1') as HTMLCanvasElement;

    if (!ctx) {
      console.error("Canvas element 'pieChart1' not found!");
      return;
    }

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
            backgroundColor: ['#266CA9', '#FF6384', '#689F7A', '#FFCE56', '#FF9F40'], 
            hoverBackgroundColor: ['#19609d', '#D54866', '#568B67', '#E0B443', '#D9832D'] 
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
              label: function(tooltipItem: any) {
                const value = tooltipItem.raw || 0;
                return `${tooltipItem.label}: ${value} Posts`; 
              }
            }
          }
        }
      }
    });
  }

  // most liked posts
  getMostLikedPosts(): void {
    this.AS.getMostLikedPosts().subscribe(
      (response) => {
        if (response && response.posts.length > 0) {
          this.mostLikedTitles = response.posts.map((post: MostLikedPost) => post.title);
          this.mostLikedCounts = response.posts.map((post: MostLikedPost) => post.total_likes);
          this.mostLikedPieChart(); // Update Pie Chart 2
        } else {
          console.warn('No liked posts found.');
          this.mostLikedTitles = [];
          this.mostLikedCounts = [];
          this.mostLikedPieChart(); // Update to clear chart if empty
        }
      },
      (error) => {
        console.error('Error fetching most liked posts:', error);
      }
    );
  }

  mostLikedPieChart(): void {
    const ctx = document.getElementById('pieChart2') as HTMLCanvasElement;

    if (!ctx) {
      console.error("Canvas element 'pieChart2' not found!");
      return;
    }

    if (this.pieChart2) {
      this.pieChart2.destroy();
    }

    this.pieChart2 = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.mostLikedTitles,
        datasets: [
          {
            label: 'Most Liked Posts',
            data: this.mostLikedCounts,  
            backgroundColor: ['#266CA9', '#FF6384', '#689F7A', '#FFCE56', '#FF9F40'], 
            hoverBackgroundColor: ['#19609d', '#D54866', '#568B67', '#E0B443', '#D9832D'] 
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
              label: function(tooltipItem: any) {
                const value = tooltipItem.raw || 0;
                return `${tooltipItem.label}: ${value} Likes`; 
              }
            }
          }
        }
      }
    });
  }


  dashboardCounts(): void {
    this.AS.dashboardStatistics().subscribe(
      (response) => {  
        this.totalPosts = response['total_user_posts'] || 0;
        this.totalReportedPosts = response['total_reported_posts'] || 0;
        this.totalBarangayPosts = response['total_barangay_posts'] || 0;
        this.totalUsers = response['total_users'] || 0;
        
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching dashboard counts:', error);
      }
    );
  }  
}

interface ActiveUser {
  id: number;
  name: string;
  total_posts: number;
}

interface MostLikedPost {
  id: number;
  title: string;
  total_likes: number;
}