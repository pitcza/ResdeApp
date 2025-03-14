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
  categoriesTable: string[] = ['category', 'total_posts'];
  materialsTable: string[] = ['materials', 'total_posts'];
  activeUsersTable: string[] = ['fullName', 'total_posts', 'total_likes', 'badge'];
  topLikesTable: string[] = ['fullName', 'post_title', 'total_likes', 'badge'];
  DataSource: MatTableDataSource<TableElement> = new MatTableDataSource();

  previewData: any[] = [];
  previewVisible = false;

  isLoading = true;

  category = new MatTableDataSource<any>();
  materials: MatTableDataSource<any> = new MatTableDataSource();
  users: MatTableDataSource<any> = new MatTableDataSource();
  liked: MatTableDataSource<any> = new MatTableDataSource();

  fromDate: string = '';  
  toDate: string = '';    

  startDate: string ='';
  endDate: string ='';

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('paginator3') paginator3!: MatPaginator;

  constructor(
    private AS: AdminDataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getMaterialsCount();
    this.getCategories();
    this.getTopUsers();
    this.getTopLiked();
  }

  ngAfterViewInit(): void {
    if (this.category) { this.category.paginator = this.paginator; }
    if (this.users) { this.users.paginator = this.paginator1; }
    if (this.liked) { this.liked.paginator = this.paginator2; }
    this.cdr.detectChanges();
  }

  onSubmit() {
    this.getCategories(this.startDate, this.endDate);
  }

  getMaterialsCount(): void {
    this.isLoading = true;

    this.AS.materialsPosted().subscribe(
      (data) => {
        console.log('Materials Count API Response:', data);

        const sortedMaterials = Object.entries(data).map(([material, count]) => ({
          materials: material,  // Ensure it matches table column name
          total_posts: Number(count) // Convert to number
        })).sort((a, b) => b.total_posts - a.total_posts); // Sort descending

        this.materials.data = sortedMaterials;

        if (this.paginator3) {
          this.materials.paginator = this.paginator3;
        }

        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching materials count:', error);
        this.isLoading = false;
      }
    );
  }
  
  // tinanggal ko this pero nasa backend pa
  getCategories(startDate?: string, endDate?: string): void {
    this.isLoading = true;
    this.AS.tableCategories(startDate, endDate)
    .subscribe(
      (data) => {
        console.log('API Response:', data); // Make sure the data is correct
        this.category.data = data;
        this.isLoading = false;

        if (this.paginator) {
          this.category.paginator = this.paginator;
        }
        
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getTopUsers(): void {
    this.isLoading = true;
    this.AS.topUsers().subscribe(
      (data) => {
        console.log('Top Users API Response:', data);
  
        this.users.data = data.sort((a: any, b: any) => b.total_posts - a.total_posts);
        this.isLoading = false;
  
        if (this.paginator1) {
          this.users.paginator = this.paginator1;
        }
      },
      (error) => {
        console.error('Error fetching top users:', error);
        this.isLoading = false;
      }
    );
  }

  getTopLiked(): void {
    this.isLoading = true;
    this.AS.topLiked().subscribe(
      (data) => {
        console.log('Top Liked API Response:', data);
  
        this.liked.data = data.sort((a: any, b: any) => b.total_posts - a.total_posts);
        this.isLoading = false;
  
        if (this.paginator1) {
          this.liked.paginator = this.paginator1;
        }
      },
      (error) => {
        console.error('Error fetching top liked:', error);
        this.isLoading = false;
      }
    );
  }

  // categories posted
  exportToExcel(): void {
    // Make sure category data exists before exporting
    if (this.materials && this.materials.data) {
      // Get the current date for the filename
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `Barangay Gordon Heights Most Talked-About - ${currentDate}.xlsx`;

      // Define styles
      const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 }, // White bold text, larger font size
        fill: { fgColor: { rgb: '266CA9' } }, // Blue background
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
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.materials.data);

      // Add a merged header for "Most Talked About Issues"
      const headerText = "Most Talked-About Issues";
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
      XLSX.utils.sheet_add_aoa(ws, [['Materials', 'Total Posts']], { origin: 'A2' }); // Add titles to row 2

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
    if (this.users && this.users.data) {
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `Active Users - ${currentDate}.xlsx`;
  
      const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
        fill: { fgColor: { rgb: '266CA9' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
      };
  
      const dataStyle = {
        font: { color: { rgb: '000000' } },
        alignment: { horizontal: 'left' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
      };
  
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
      // Add Title Row
      XLSX.utils.sheet_add_aoa(ws, [['Active Users Report']], { origin: 'A1' });
  
      // Merge A1 to D1 for the title
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
  
      // Add Headers in row 2
      XLSX.utils.sheet_add_aoa(ws, [['Full Name', 'Total Posts', 'Total Likes', 'Badge']], { origin: 'A2' });
  
      // Append Data from row 3
      XLSX.utils.sheet_add_json(ws, this.users.data, { origin: 'A3', skipHeader: true });
  
      // Apply styles to title
      ws['A1'].s = headerStyle;
  
      // Apply styles to headers
      for (let col = 0; col < 4; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: 1, c: col });
        if (ws[headerCell]) ws[headerCell].s = headerStyle;
      }
  
      // Apply styles to data
      const range = XLSX.utils.decode_range(ws['!ref']!);
      for (let row = 2; row <= range.e.r; row++) {
        for (let col = 0; col <= range.e.c; col++) {
          const dataCell = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[dataCell]) ws[dataCell].s = dataStyle;
        }
      }
  
      // Set column widths
      ws['!cols'] = [{ width: 30 }, { width: 15 }, { width: 15 }, { width: 20 }];

      if (!ws['!rows']) ws['!rows'] = [];
      ws['!rows'].push({ hpx: 40 });
  
      // Create workbook and export
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Active Users');
      XLSX.writeFile(wb, fileName);
    } else {
      console.error('No user data available for export');
    }
  }

  exportToExcel2(): void {
    if (this.liked && this.liked.data) {
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `Most Liked Posts - ${currentDate}.xlsx`;
  
      const headerStyle = {
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 14 },
        fill: { fgColor: { rgb: '266CA9' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
      };
  
      const dataStyle = {
        font: { color: { rgb: '000000' } },
        alignment: { horizontal: 'left' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } },
      };
  
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  
      // Add Title Row
      XLSX.utils.sheet_add_aoa(ws, [['Most Liked Posts Report']], { origin: 'A1' });
  
      // Merge A1 to D1 for the title
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } });
  
      // Add Headers in row 2
      XLSX.utils.sheet_add_aoa(ws, [['Full Name', 'Post Title', 'Total Likes', 'Badge']], { origin: 'A2' });
  
      // Append Data from row 3
      XLSX.utils.sheet_add_json(ws, this.liked.data, { origin: 'A3', skipHeader: true });
  
      // Apply styles to title
      ws['A1'].s = headerStyle;
  
      // Apply styles to headers
      for (let col = 0; col < 4; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: 1, c: col });
        if (ws[headerCell]) ws[headerCell].s = headerStyle;
      }
  
      // Apply styles to data
      const range = XLSX.utils.decode_range(ws['!ref']!);
      for (let row = 2; row <= range.e.r; row++) {
        for (let col = 0; col <= range.e.c; col++) {
          const dataCell = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[dataCell]) ws[dataCell].s = dataStyle;
        }
      }
  
      // Set column widths
      ws['!cols'] = [{ width: 30 }, { width: 40 }, { width: 15 }, { width: 20 }];

      if (!ws['!rows']) ws['!rows'] = [];
      ws['!rows'].push({ hpx: 40 });
  
      // Create workbook and export
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Most Liked');
      XLSX.writeFile(wb, fileName);
    } else {
      console.error('No liked data available for export');
    }
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
  materials: string;
  total: string;
}