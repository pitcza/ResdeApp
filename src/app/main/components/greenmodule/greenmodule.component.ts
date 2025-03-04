import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../../../services/dataservice.service';

@Component({
  selector: 'app-greenmodule',
  templateUrl: './greenmodule.component.html',
  styleUrls: ['./greenmodule.component.scss']
})
export class GreenmoduleComponent implements OnInit {
  trivia: any = null;
  selectedAnswer: string = '';
  userAnswer: string = '';
  isCorrect: boolean = false;
  hasAnswered: boolean = false;
  loading: boolean = true;
  errorMessage: string = '';
  showResults: boolean = false; // ✅ Fix 1: Declare showResults

  constructor(private ds: DataserviceService) {}

  ngOnInit(): void {
    this.getTriviaQuestion();
  }

  getTriviaQuestion(): void {
    this.ds.getTodayTrivia().subscribe(
      (data) => {
        this.trivia = data;
        this.checkIfAnswered();
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load trivia.';
        this.loading = false;
      }
    );
  }

  checkIfAnswered(): void {
    this.ds.getUserScore().subscribe(
      (data) => {
        console.log("Checking if user has already answered:", data);
  
        const answeredTrivia = data.find((q: any) => q.trivia_question_id === this.trivia.id);
        if (answeredTrivia) {
          this.hasAnswered = true;
          this.showResults = true;
          this.userAnswer = answeredTrivia.user_answer;
          this.isCorrect = this.userAnswer === this.trivia.correct_answer;
        } else {
          this.hasAnswered = false;
          this.showResults = false;
        }
      },
      (error) => {
        console.error("Error fetching user score:", error);
      }
    );
  }  

  submitTriviaAnswer(): void {
    if (!this.selectedAnswer) {
      alert('Please select an answer!');
      return;
    }
  
    if (this.hasAnswered) {
      alert('You have already answered this trivia.');
      return;
    }
  
    this.ds.submitAnswer(this.trivia.id, this.selectedAnswer).subscribe(
      (response) => {
        this.hasAnswered = true;
        this.showResults = true;
        this.userAnswer = this.selectedAnswer;
        this.isCorrect = response.correct;
  
        console.log("Answer submitted successfully:", response);
      },
      (error) => {
        alert('Error submitting answer.');
      }
    );
  }  
}
