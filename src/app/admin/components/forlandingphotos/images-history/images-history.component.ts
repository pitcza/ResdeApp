import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AdminDataService } from '../../../../services/admin-data.service';
import Swal from 'sweetalert2';

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

    if (idsToDelete.length === 0) {
      Swal.fire({
        title: "No Images Found",
        text: "There are no images to delete.",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor: "#7f7f7f"
      });
      return;
    }

    // Show confirmation before deleting all images
    Swal.fire({
      title: "Delete All Previous Images",
      text: `Are you sure you want to delete ${idsToDelete.length} previous uploaded? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete All",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7f7f7f"
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminDataService.deleteAllPhotos(idsToDelete).subscribe(
          (response) => {
            console.log("Images deleted successfully:", response);

            Swal.fire({
              title: "Images Deleted!",
              text: "All previous images have been successfully deleted.",
              icon: "success",
              confirmButtonText: "Close",
              confirmButtonColor: "#7f7f7f",
              timer: 5000
            });

            // Refresh the images history after deletion
            this.fetchImagesHistory();
          },
          (error) => {
            console.error("Error deleting images:", error);
            Swal.fire({
              title: "Deletion Failed",
              text: "Something went wrong. Please try again.",
              icon: "error",
              confirmButtonText: "Close",
              confirmButtonColor: "#7f7f7f"
            });
          }
        );
      }
    });
  }

  deletePhotoEntry(entryId: number): void {
    Swal.fire({
      title: "Delete Images",
      text: "Are you sure you want to delete these photos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#7f7f7f"
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminDataService.deletePhotoById(entryId).subscribe(
          () => {
            console.log("Photo entry deleted successfully");

            Swal.fire({
              title: "Images Deleted",
              text: "The photos has been successfully deleted.",
              icon: "success",
              confirmButtonText: "Close",
              confirmButtonColor: "#7f7f7f",
              timer: 3000
            });

            // Update UI by removing the deleted photo
            this.imagesHistory = this.imagesHistory.filter((entry) => entry.id !== entryId);
          },
          (error) => {
            console.error("Error deleting photo entry:", error);
            Swal.fire({
              title: "Deletion Failed",
              text: "Something went wrong. Please try again.",
              icon: "error",
              confirmButtonText: "Close",
              confirmButtonColor: "#7f7f7f"
            });
          }
        );
      }
    });
  }
}
