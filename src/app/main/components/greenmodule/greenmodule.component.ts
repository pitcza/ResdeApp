import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../../services/dataservice.service';
import Swal from 'sweetalert2';

interface TriviaQuestion {
  id: number;
  question: string;
  answers: string[];
  correct_answer: string;
}

@Component({
  selector: 'app-greenmodule',
  templateUrl: './greenmodule.component.html',
  styleUrls: ['./greenmodule.component.scss']
})
export class GreenmoduleComponent implements OnInit {
  triviaQuestions: TriviaQuestion[] = [];
  userAnswers: (string | null)[] = []; // Allow null values
  showResults = false;
  score = 0;
  errorMessage: string | null = null;

  constructor(private ds: DataserviceService) {}

  ngOnInit(): void {
    this.loadTriviaQuestions();
  }

  loadTriviaQuestions(): void {
    this.ds.getQuestions().subscribe(
      (questions) => {
        this.triviaQuestions = questions;
  
        this.ds.getUserScore().subscribe(
          (scores) => {
            let totalScore = 0;
  
            this.userAnswers = this.triviaQuestions.map((question) => {
              const existingScore = scores.find((score: any) => score.question_id === question.id);
              if (existingScore) {
                totalScore += existingScore.score; 
                return 'answered';
              }
              return null; 
            });
  
            const allAnswered = this.userAnswers.every((answer) => answer === 'answered');
            if (allAnswered) {
              this.showResults = true;
              this.score = totalScore; 
            }
          },
          (error) => {
            console.error('Error fetching user scores', error);
          }
        );
  
        this.errorMessage = null; 
      },
      (error) => {
        console.error('Error fetching trivia questions', error);
        this.errorMessage = 'Failed to load trivia questions. Please try again later.';
      }
    );
  }
  
  submitAnswers() {
    // Find unanswered question indices
    const unanswered = this.triviaQuestions
      .map((q, index) => (this.userAnswers[index] ? null : index + 1))
      .filter((num) => num !== null);
  
    if (unanswered.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Please answer all questions before submitting! Missing: ${unanswered.join(', ')}`,
      });
      return;
    }
  
    // Proceed with normal submission logic
    this.score = 0;
    const submitPromises = this.triviaQuestions.map((question, index) => {
      const userAnswer = this.userAnswers[index];
      if (userAnswer && userAnswer !== 'answered') {
        return this.ds
          .submitAnswer(question.id, userAnswer)
          .toPromise()
          .then((response) => {
            if (response && response.score) {
              this.score++; // Increment score for correct answers
            }
          })
          .catch((error) => {
            console.error(`Error submitting answer for question ${question.id}:`, error);
          });
      }
      return Promise.resolve();
    });
  
    Promise.all(submitPromises).then(() => {
      this.showResults = true;
    });
  }
}
