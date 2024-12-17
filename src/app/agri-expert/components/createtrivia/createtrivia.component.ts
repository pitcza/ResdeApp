import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminDataService } from '../../../services/admin-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-createtrivia',
  templateUrl: './createtrivia.component.html',
  styleUrls: ['./createtrivia.component.scss'],
})
export class CreatetriviaComponent implements OnInit {
  triviaForm: FormGroup;
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminDataService,
    public dialogRef: MatDialogRef<CreatetriviaComponent>, // MatDialog reference
    @Inject(MAT_DIALOG_DATA) public data: any // Data passed to dialog
  ) {
    this.triviaForm = this.fb.group({
      question: ['', Validators.required],
      correct_answer: ['', Validators.required],
      answers: this.fb.array([this.fb.control('', Validators.required)]),
    });
  }

  ngOnInit(): void {}

  get answers(): FormArray {
    return this.triviaForm.get('answers') as FormArray;
  }

  addAnswer(): void {
    this.answers.push(this.fb.control('', Validators.required));
  }

  removeAnswer(index: number): void {
    this.answers.removeAt(index);
  }

  onSubmit(): void {
    if (this.triviaForm.valid) {
      const formData = this.triviaForm.value;
      this.adminService.createQuestions(formData).subscribe({
        next: (response) => {
          this.successMessage = 'Trivia question created successfully!';
          this.dialogRef.close(response); // Close dialog and pass back data
        },
        error: (err) => {
          console.error('Error creating trivia question:', err);
        },
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close dialog without action
  }
}
