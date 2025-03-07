import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AdminDataService } from '../../../services/admin-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-createtrivia',
  templateUrl: './createtrivia.component.html',
  styleUrls: ['./createtrivia.component.scss'],
})
export class CreatetriviaComponent implements OnInit {
  triviaForm: FormGroup;
  categories: string[] = ['Reduce', 'Reuse', 'Recycle', 'Gardening'];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminDataService,
    public dialogRef: MatDialogRef<CreatetriviaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.triviaForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      facts: ['', Validators.required],
      question: ['', Validators.required],
      correct_answer: ['', Validators.required],
      answers: this.fb.array(
        [this.fb.control('', Validators.required), this.fb.control('', Validators.required)],
        [Validators.minLength(2), Validators.maxLength(4)]
      ),
    });
  }

  ngOnInit(): void {
    this.triviaForm = this.fb.group({
      category: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      facts: ['', Validators.required],
      question: ['', Validators.required],
      correct_answer: ['', Validators.required],
      answers: this.fb.array(
        [this.fb.control('', Validators.required), this.fb.control('', Validators.required)],
        [Validators.minLength(2), Validators.maxLength(4)]
      ),
    });
  }

  get answers(): FormArray {
    return this.triviaForm.get('answers') as FormArray;
  }

  addAnswer(): void {
    if (this.answers.length < 4) {
      this.answers.push(this.fb.control('', Validators.required));
    }
  }

  removeAnswer(index: number): void {
    if (this.answers.length > 2) {
      this.answers.removeAt(index);
    }
  }

  addAnswerOnEnter(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' && this.answers.length < 4) {
      event.preventDefault();
      const currentInput = this.answers.at(index);
      if (currentInput?.value?.trim()) {
        this.addAnswer();
        setTimeout(() => {
          const nextInput = document.querySelector(
            `input[placeholder="Answer ${this.answers.length}"]`
          ) as HTMLInputElement;
          nextInput?.focus();
        });
      }
    }
  }

  onSubmit(): void {
    if (this.triviaForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }
  
    Swal.fire({
      title: 'Confirmation',
      text: "Are you sure you want to submit this trivia and question?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Submit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#266CA9',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User confirmed submission, sending data...");
  
        const triviaData = {
          ...this.triviaForm.value,
          answers: this.triviaForm.value.answers.map((a: string) => a.trim()),
        };
  
        this.adminService.createQuestions(triviaData).subscribe(
          (response) => {
            console.log("Trivia posted successfully:", response);
            
            Swal.fire({
              title: 'Trivia Posted',
              text: 'Trivia question created successfully!',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#266CA9'
            });
              this.dialogRef.close(true);
          },
          (error) => {
            console.error("Error creating trivia:", error);
            Swal.fire({
              title: 'Error!',
              text: 'An error occurred while creating trivia.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        );
      } else {
        console.log("User canceled submission.");
      }
    });
  }
  

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
