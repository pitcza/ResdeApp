import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminDataService } from '../../../services/admin-data.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'title', 'content'];
  postForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ImagePreview: string | ArrayBuffer | null = null;
  image: File | null = null;
  isLoading: boolean = true;
  dataSource = new MatTableDataSource<TableElement>();
  filteredDataSource: MatTableDataSource<TableElement> = new MatTableDataSource();
  fromDate: string = '';  // For the "from" date
  toDate: string = '';    // For the "to" date

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private as: AdminDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initForm();
    this.fetchAnnouncement();
  }

  ngAfterViewInit() {
    this.filteredDataSource.paginator = this.paginator;
  }

  private initForm() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null]
    });
  }

  onFileSelected(event: any) {
    this.image = event.target.files[0];
    if (this.image) {
      this.postForm.patchValue({ image: this.image });
    }
  }

  fetchAnnouncement(): void {
    this.isLoading = true;
    const params = {
      start_date: this.fromDate,
      end_date: this.toDate
    };
  
    this.as.getAnn(params).subscribe(
      (response) => {
        console.log('API Response:', response);
  
        const posts = response ?? [];
        this.dataSource.data = posts; // Use `.data` to update the existing data source
        this.filteredDataSource.data = posts; // Update filtered data
        this.filteredDataSource.paginator = this.paginator; // Reassign paginator
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }
  

  filterPosts() {
    if (!this.dataSource || !(this.dataSource instanceof MatTableDataSource)) {
      console.error('DataSource is not properly initialized.');
      return;
    }
  
    const filteredData = this.dataSource.data.filter((post: TableElement) => {
      const postDate = post.created_at ? new Date(post.created_at) : null; // Handle undefined/null
      const fromDateMatch = this.fromDate ? postDate && postDate >= new Date(this.fromDate) : true;
      const toDateMatch = this.toDate ? postDate && postDate <= new Date(this.toDate) : true;
      return fromDateMatch && toDateMatch;
    });
  
    this.filteredDataSource.data = filteredData; // Update data, don't reinitialize the object
  }
  

  onDateChange(event: any, type: string) {
    const selectedDate = event.target.value;
    if (type === 'from') {
      this.fromDate = selectedDate;
    } else if (type === 'to') {
      this.toDate = selectedDate;
    }
    this.filterPosts(); // Trigger filtering whenever date changes
  }

  onSubmit() {
    if (this.postForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.postForm.get('title')!.value);
    formData.append('description', this.postForm.get('description')!.value);
    if (this.image) {
      formData.append('image', this.image);
    }

    this.as.uploadAnn(formData).subscribe(
      (response) => {
        console.log('Post created successfully', response);
        Swal.fire({
          title: 'Announcement Posted',
          text: 'Users can now view your posted announcement.',
          icon: 'success',
          iconColor: '#689f7a',          
          confirmButtonText: 'Close',
          confirmButtonColor: '#7f7f7f',
          timer: 5000,
          scrollbarPadding: false
        });
        this.fetchAnnouncement(); // Refresh posts after submission
      },
      (error) => {
        console.error('Error creating post', error);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while creating the post.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#777777'
        });
      }
    );
  }

  cancelPopup() {
    // Check if any of the form fields are not empty
    const titleValue = this.postForm.get('title')?.value;
    const descriptionValue = this.postForm.get('description')?.value;
    const imageValue = this.image;
  
    if (titleValue || descriptionValue || imageValue) {
      // Show the confirmation popup only if the form has some data
      Swal.fire({
        title: 'Discard post?',
        text: 'You\'ll lose this post if you discard changes.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#C14141',
        cancelButtonColor: '#7f7f7f',
        confirmButtonText: 'Discard',
        cancelButtonText: 'Keep editing',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();  // Refresh the page
        }
      });
    }
  }
  
}

export interface TableElement {
  created_at?: string;
  category?: string;
  title: string;
  status?: string;
  id: number;
  description: string;
}
