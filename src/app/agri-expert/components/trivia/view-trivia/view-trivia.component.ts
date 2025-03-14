import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AdminDataService } from '../../../../services/admin-data.service';

@Component({
  selector: 'app-view-trivia',
  templateUrl: './view-trivia.component.html',
  styleUrl: './view-trivia.component.scss'
})
export class ViewTriviaComponent implements OnInit {
  id!: number;
  triviaData: any = null; // Ensure it starts as null to avoid undefined errors

  constructor(
    public dialogRef: MatDialogRef<ViewTriviaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private as: AdminDataService,
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.id = this.data.id;
      this.fetchTriviaData();
    } else {
      console.error("Invalid data passed to dialog:", this.data);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  fetchTriviaData() {
    this.as.getQuestionById(this.id).subscribe(
      (data) => {
        console.log('Fetched Post Data:', data);
        this.triviaData = data; // Fix: Directly assigning data instead of data.triviaData
      },
      (error) => {
        console.error('Error fetching post data', error);
      }
    );
  }

  deletequest(id: number): void {
    Swal.fire({
      title: 'Delete Trivia Quiz',
      text: 'Are you sure you want to delete this trivia and question?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.deletequestion(id).subscribe({
          next: () => {
            Swal.fire({
              title: "Trivia Quiz Deleted!",
              text: "The trivia and question has been successfully deleted.",
              icon: "success",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              timer: 2000,
              scrollbarPadding: false
            });
              // Close the dialog after deletion
              this.dialogRef.close(true); 
              this.fetchTriviaData();
          },
          error: (err) => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete the question. Please try again.",
              icon: "error",
              confirmButtonText: 'Close',
              confirmButtonColor: "#777777",
              scrollbarPadding: false
            });
            console.error(err);
          }
        });
      }
    });
  }
  

  formatContent(content: string | null): string {
    return content ? content.replace(/\n/g, '<br>') : 'N/A';
  }
}