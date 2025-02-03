import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminDataService } from '../../../../services/admin-data.service';

@Component({
  selector: 'app-images-history',
  templateUrl: './images-history.component.html',
  styleUrls: ['./images-history.component.scss']
})
export class ImagesHistoryComponent implements OnInit {
  imagesHistory: any[] = [];
  displayedColumns: string[] = ['created_at', 'images', 'action'];  // Declare displayed columns array

  constructor(
    public dialogRef: MatDialogRef<ImagesHistoryComponent>,
    private adminDataService: AdminDataService
  ) {}

  // Close dialog
  closeDialog() {
    this.dialogRef.close();
  }

  // Fetch images history data on component initialization
  ngOnInit(): void {
    this.fetchImagesHistory();
  }

  // Method to fetch images history from backend
  fetchImagesHistory(): void {
    this.adminDataService.getAllLandingPhotos().subscribe(
      (data: any[]) => {
        // Sort the data by created_at to get the most recent one first
        data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
        // Exclude the latest uploaded image by slicing the array
        this.imagesHistory = data.slice(1);  // Exclude the first item (latest uploaded image)
      },
      (error) => {
        console.error('Error fetching images history:', error);
      }
    );
  }

  // Method to delete all images except the latest
  deleteAllImages(): void {
    const idsToDelete = this.imagesHistory.map((image) => image.id);

    if (idsToDelete.length > 0) {
      this.adminDataService.deleteAllPhotos(idsToDelete).subscribe(
        (response) => {
          console.log('Images deleted successfully:', response);
          // Refresh the images history after deletion
          this.fetchImagesHistory();
        },
        (error) => {
          console.error('Error deleting images:', error);
        }
      );
    } else {
      console.log('No images to delete');
    }
  }
}
