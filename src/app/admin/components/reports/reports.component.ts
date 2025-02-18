import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminDataService } from '../../../services/admin-data.service';
import { Chart } from 'chart.js/auto';
import { MatPaginator } from '@angular/material/paginator';
// import * as XLSX from 'xlsx';  // Import XLSX
import * as XLSX from 'xlsx-js-style';
import { HttpParams } from '@angular/common/http';

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

  isLoading = true;

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

  onSubmit() {
    // Call the getCategories method with the selected startDate and endDate
    this.getCategories(this.startDate, this.endDate);
  }
  
  
  getCategories(startDate?: string, endDate?: string): void {
    this.isLoading = true;
    this.AS.tableCategories(startDate, endDate)
      .subscribe(
        (data) => {
          console.log('API Response:', data); // Make sure the data is correct
          this.category.data = data;
          this.isLoading = false;
  
          // Handle pagination if needed
          if (this.paginator) {
            this.category.paginator = this.paginator;
          }
          
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  getUserTotalPost(): void {
    this.isLoading = true;
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
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching total posts per user', error);
      }
    );
  }

  getUserTotalPosts(): void {
    this.isLoading = true;
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
        this.isLoading = false;
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
    this.isLoading = true;
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
        this.isLoading = false;
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



// onDateChange(event: Event, type: 'from' | 'to'): void {
//   const input = event.target as HTMLInputElement;
//   if (type === 'from') {
//     this.fromDate = input.value;
//   } else if (type === 'to') {
//     this.toDate = input.value;
//   }
//   this.getCategories(); // Fetch filtered data whenever the date changes
// }

  togglePreview(): void {
    this.previewVisible = !this.previewVisible;
    this.previewData = this.reports.data;
  }

  exportToExcel(): void {
    // Make sure category data exists before exporting
    if (this.category && this.category.data) {
      // Get the current date for the filename
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `Barangay Gordon Heights Most Talked About - ${currentDate}.xlsx`;

      // Define styles
      const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 }, // White bold text, larger font size
        fill: { fgColor: { rgb: '568b67' } }, // Blue background
        alignment: { horizontal: 'center', vertical: 'center' }, // Center-aligned text (horizontally and vertically)
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };

      const dataStyle = {
        font: { color: { rgb: '000000' } }, // Black text
        alignment: { horizontal: 'left' }, // Left-aligned text
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };

      // Convert data to Excel sheet
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.category.data);

      // Add a merged header for "Most Talked About Issues"
      const headerText = "Most Talked About Issues";
      XLSX.utils.sheet_add_aoa(ws, [[headerText]], { origin: 'A1' }); // Add text to cell A1

      // Merge cells A1 and B1
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }); // Merge columns 1 and 2 in row 1

      // Apply header style to the merged cell
      const mergedHeaderCell = ws['A1'];
      if (mergedHeaderCell) {
        mergedHeaderCell.s = headerStyle;
      }

      // Set custom column widths
      const columnWidths = [
        { width: 40 }, // Width for column 1 (Categories)
        { width: 20 }, // Width for column 2 (Total Posts)
        { width: 15 }, // Width for column 3 (if any)
      ];
      ws['!cols'] = columnWidths;

      // Set custom row height for the merged header (row 1)
      if (!ws['!rows']) ws['!rows'] = [];
      ws['!rows'].push({ hpx: 40 }); // Set height of row 1 to 40 pixels

      // Shift existing data down by 1 row to make space for the new header
      const range = XLSX.utils.decode_range(ws['!ref']!);
      range.e.r += 1; // Expand the range by 1 row
      ws['!ref'] = XLSX.utils.encode_range(range);

      // Move existing data down by 1 row
      for (let row = range.e.r; row > 0; row--) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          const newCellAddress = XLSX.utils.encode_cell({ r: row + 1, c: col });
          if (ws[cellAddress]) {
            ws[newCellAddress] = ws[cellAddress];
            delete ws[cellAddress];
          }
        }
      }

      // Add header titles for "Categories" and "Total Posts" in row 2
      XLSX.utils.sheet_add_aoa(ws, [['Categories', 'Total Posts']], { origin: 'A2' }); // Add titles to row 2

      // Apply header styles to the new header row (row 2)
      for (let col = range.s.c; col <= range.e.c; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: 1, c: col }); // Row 2 (index 1)
        if (!ws[headerCell]) continue;
        ws[headerCell].s = headerStyle; // Apply header style
      }

      // Apply data styles to the remaining rows
      for (let row = range.s.r + 2; row <= range.e.r + 1; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const dataCell = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws[dataCell]) continue;
          ws[dataCell].s = dataStyle; // Apply data style
        }
      }

      // Create workbook and append the styled sheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reports');

      // Write and export the file
      XLSX.writeFile(wb, fileName);
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