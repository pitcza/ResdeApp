import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminDataService } from '../../../services/admin-data.service';

@Component({
  selector: 'app-edit-trivia',
  templateUrl: './edit-trivia.component.html',
  styleUrl: './edit-trivia.component.scss'
})
export class EditTriviaComponent {
  triviaForm: FormGroup;
  id: number;

  constructor(
    public dialogRef: MatDialogRef<EditTriviaComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private fb: FormBuilder,
    private as: AdminDataService
  ) {
    console.log('Dialog Data:', data);  // Check if data is passed correctly
    this.id = data.id; 
    this.triviaForm = this.fb.group({
      question: [data.question, Validators.required],
      correct_answer: [data.correct_answer, Validators.required] 
    });
  }

  updateTrivia(): void {
    console.log('Form Status:', this.triviaForm.status);
    console.log('Form Valid:', this.triviaForm.valid);
    console.log('Form Errors:', this.triviaForm.errors);
    console.log('Form Controls:', this.triviaForm.controls);

    if (this.triviaForm.invalid) {
      console.error('Form is invalid, update not executed');
      return;
    }

    const updatedTriviaData = {
      question: this.triviaForm.value.question,
      correct_answer: this.triviaForm.value.correct_answer
    };

    console.log('Updated trivia data:', updatedTriviaData);  // Log the updated data

    // Call the update trivia service
    this.as.updatequestions(this.id, updatedTriviaData).subscribe(
      (response) => {
        console.log('Trivia updated successfully', response);
        this.dialogRef.close(true); // Close dialog on success
      },
      (error) => {
        console.error('Error updating trivia:', error);
        this.dialogRef.close(false); // Close dialog on error
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();  // Close the dialog without making any changes
  }
}
