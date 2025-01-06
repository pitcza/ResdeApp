import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-trivia',
  templateUrl: './edit-trivia.component.html',
  styleUrl: './edit-trivia.component.scss'
})
export class EditTriviaComponent {
  constructor(
    public dialogRef: MatDialogRef<EditTriviaComponent>, // MatDialog reference
  ) {

  }

  // huhu idunno
  updateTrivia(): void { }

  closeDialog(): void {
    this.dialogRef.close(); // Close dialog without action
  }
}
