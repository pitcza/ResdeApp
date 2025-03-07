import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { DataserviceService } from '../../../../services/dataservice.service';

@Component({
  selector: 'app-view-brgypost',
  templateUrl: './view-brgypost.component.html',
  styleUrl: './view-brgypost.component.scss'
})
export class ViewBrgypostComponent {
  id!: number;  // To store the post ID
  post: any;       // To store the post data
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataserviceService,
    public dialogRef: MatDialogRef<ViewBrgypostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.fetchPostDetails(this.id);
  }

  fetchPostDetails(id: number): void {
    this.isLoading = true;
    
    this.dataService.getBarangayPostById(id).subscribe(
      (response) => {
        console.log('Fetched Post Data:', response); // Debug API response
  
        // Check if the response is structured correctly
        this.post = response.post ? response.post : response; 
        
        console.log('Final Post Data:', this.post); // Ensure it has images & caption
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching post data', error);
        this.isLoading = false;
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }
}
