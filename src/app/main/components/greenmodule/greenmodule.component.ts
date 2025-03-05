import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataserviceService } from '../../../services/dataservice.service';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-greenmodule',
  templateUrl: './greenmodule.component.html',
  styleUrls: ['./greenmodule.component.scss']
})
export class GreenmoduleComponent implements OnInit, OnDestroy {
  barangayPosts: any[] = []; // Store posts here
  isLoading: boolean = true; // Loading state
  private routerSubscription!: Subscription;
  
  trivia: any = null;
  selectedAnswer: string = '';
  userAnswer: string = '';
  isCorrect: boolean = false;
  hasAnswered: boolean = false;
  loading: boolean = true;
  errorMessage: string = '';
  showResults: boolean = false; // ✅ Fix 1: Declare showResults

  constructor(
    private router: Router,
    private ds: DataserviceService
  ) {}

  ngOnInit(): void {
    this.getTriviaQuestion();

    this.fetchBarangayPosts(); // Initial fetch

    // ✅ Detect when the user navigates back to this tab
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.fetchBarangayPosts();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Fetch All Barangay Posts
  fetchBarangayPosts() {
    this.isLoading = true; // Show skeleton loader
    this.ds.getBarangayPosts().subscribe(
      (posts) => {
        this.barangayPosts = posts;
        this.isLoading = false; // Hide skeleton loader
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  getTriviaQuestion(): void {
    this.ds.getTodayTrivia().subscribe(
      (data) => {
        this.trivia = data;
        this.checkIfAnswered();
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'No trivia for today.';
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
