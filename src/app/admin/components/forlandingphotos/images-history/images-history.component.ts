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
  displayedColumns: string[] = ['created_at', 'images', 'content', 'action'];  // Declare displayed columns array

  isLoading = true;

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
    this.isLoading = true;

    this.adminDataService.getAllLandingPhotos().subscribe(
      (response: any) => {
        if (response.data && response.data.length > 0) {
          // Transform data structure to match UI needs
          this.imagesHistory = response.data.map((photo: any) => ({
            id: photo.id,
            created_at: photo.created_at,
            imagesWithContent: [
              { image: photo.image1 || '../../../../assets/images/NoImage.png', content: photo.content1 },
              { image: photo.image2 || '../../../../assets/images/NoImage.png', content: photo.content2 },
              { image: photo.image3 || '../../../../assets/images/NoImage.png', content: photo.content3 },
              { image: photo.image4 || '../../../../assets/images/NoImage.png', content: photo.content4 },
              { image: photo.image5 || '../../../../assets/images/NoImage.png', content: photo.content5 }
            ].filter(item => item.image) // Ensures empty image slots are removed if necessary
          }));
        } else {
          this.imagesHistory = [];
        }
        this.isLoading = false;
      },
      (error) => {
        console.error("Error fetching image history:", error);
        this.isLoading = false;
        Swal.fire({
          title: "Error",
          text: "Failed to fetch images history. Please try again later.",
          icon: "error",
          confirmButtonText: "Close",
          confirmButtonColor: "#7f7f7f"
        });
      }
    );
  }

  // Method to delete all images except the latest
  deleteAllImages(): void {
    const idsToDelete = this.imagesHistory.map((image) => image.id);

    if (idsToDelete.length === 0) {
      Swal.fire({
        title: "No Previous Highlights Found",
        text: "There are no previous highlights to delete.",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor: "#7f7f7f"
      });
      return;
    }

    // Show confirmation before deleting all images
    Swal.fire({
      title: "Delete All Previous Highlights",
      text: `Are you sure you want to delete ${idsToDelete.length} previous uploaded? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete All",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#cc4646",
      cancelButtonColor: "#7f7f7f"
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminDataService.deleteAllPhotos(idsToDelete).subscribe(
          (response) => {
            console.log("Images deleted successfully:", response);

            Swal.fire({
              title: "Previous Highlights Deleted!",
              text: "All previous photos and contents have been successfully deleted.",
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
      title: "Delete Highlight",
      text: "Are you sure you want to delete previous highlight?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#cc4646",
      cancelButtonColor: "#7f7f7f"
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminDataService.deletePhotoById(entryId).subscribe(
          () => {
            console.log("Photo entry deleted successfully");

            Swal.fire({
              title: "Previes Highlight Deleted",
              text: "The previous highlight has been successfully deleted.",
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
