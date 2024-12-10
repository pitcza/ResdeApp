import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent implements OnInit {
  displayedColumns: string[] = ['id', 'question', 'answer', 'correctAnswer', 'action'];
  dataSource!: MatTableDataSource<TriviaQuestion>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('answerInputs') answerInputs!: any;

  // Answer labels
  answerLabels: string[] = ['A', 'B', 'C', 'D'];

  triviaList: TriviaQuestion[] = [
    { id: 1, question: 'What is photosynthesis?', answer: ['Process of growing', 'Making food by sunlight', 'Storing water', 'Producing oxygen'], correctAnswer: 1 },
    // Add more trivia questions here
  ];

  isModalOpen: boolean = false;
  editingTrivia: boolean = false;
  currentTrivia: TriviaQuestion = { id: 0, question: '', answer: ['', '', '', ''], correctAnswer: 0 };

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.triviaList);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openTriviaModal() {
    this.editingTrivia = false;
    this.currentTrivia = { id: 0, question: '', answer: ['', '', '', ''], correctAnswer: 0 };
    this.isModalOpen = true;
  }

  closeTriviaModal() {
    this.isModalOpen = false;
  }

  editTrivia(trivia: TriviaQuestion) {
    this.editingTrivia = true;
    this.currentTrivia = { ...trivia };
    this.isModalOpen = true;
  }

  saveTrivia() {
    if (!this.currentTrivia.question || this.currentTrivia.answer.some(option => !option)) {
      Swal.fire('Incomplete Form', 'Please fill out all fields.', 'error');
      return;
    }

    if (this.editingTrivia) {
      const index = this.triviaList.findIndex(trivia => trivia.id === this.currentTrivia.id);
      if (index !== -1) {
        this.triviaList[index] = { ...this.currentTrivia };
        Swal.fire('Success', 'Trivia updated!', 'success');
      }
    } else {
      const newTrivia: TriviaQuestion = {
        id: this.triviaList.length + 1,
        question: this.currentTrivia.question.trim(),
        answer: this.currentTrivia.answer.map(option => option.trim()),
        correctAnswer: this.currentTrivia.correctAnswer
      };
      this.triviaList.push(newTrivia);
      Swal.fire('Success', 'Trivia added!', 'success');
    }

    this.dataSource.data = [...this.triviaList]; // Refresh table data
    this.closeTriviaModal();
  }

  deleteTrivia(id: number) {
    Swal.fire({
      title: 'Delete Trivia',
      text: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.triviaList = this.triviaList.filter(trivia => trivia.id !== id);
        this.dataSource.data = [...this.triviaList]; // Refresh table data
        Swal.fire('Deleted!', 'Trivia deleted.', 'success');
      }
    });
  }

  focusNextField(index: number): void {
    // Check if the current answer input has more than one character before focusing the next
    if (this.currentTrivia.answer[index] && this.currentTrivia.answer[index].length > 1) {
      if (index + 1 < this.currentTrivia.answer.length) {
        const nextField = document.querySelectorAll('input[type="text"]')[index + 1] as HTMLElement;
        nextField?.focus();
      }
    }
  }

  getAnswerLabel(index: number): string {
    return this.answerLabels[index] || '';
  }
}

export interface TriviaQuestion {
  id: number;
  question: string;
  answer: string[];
  correctAnswer: number;
}
