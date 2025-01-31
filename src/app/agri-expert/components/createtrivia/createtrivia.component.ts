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
  errorMessage: string = '';

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
    if (this.answers.length < 4) {
      this.answers.push(this.fb.control('', Validators.required));
    }
  }

  removeAnswer(index: number): void {
    this.answers.removeAt(index);
  }
  addAnswerOnEnter(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' && this.answers.length < 4) {
      // Prevent the default behavior of the Enter key (e.g., form submission)
      event.preventDefault();
  
      const currentInput = this.answers.at(index);
  
      // Ensure the current input is valid before adding a new one
      if (currentInput?.value?.trim()) {
        this.addAnswer();
  
        // Use `setTimeout` to ensure the DOM updates before focusing on the new input
        setTimeout(() => {
          const nextInput = document.querySelector(
            `input[placeholder="Answer ${this.answers.length}"]`
          ) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
          }
        });
      }
    }
  }
  

  onSubmit(): void {
    // Validate if the correct answer is included in the answers array
    const correctAnswer = this.triviaForm.get('correct_answer')?.value;
    const answers = this.answers.value;

    if (!answers.includes(correctAnswer)) {
      this.errorMessage = 'The correct answer must be included in the choices.';
      return;
    }

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
