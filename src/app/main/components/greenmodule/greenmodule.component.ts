import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DataserviceService } from '../../../services/dataservice.service';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ViewBrgypostComponent } from './view-brgypost/view-brgypost.component';
import { MatDialog } from '@angular/material/dialog';

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
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ds: DataserviceService
  ) {}

  showTrivia = false;

  toggleTrivia() {
    this.showTrivia = !this.showTrivia;
  }

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

  fetchBarangayPosts() {
    this.isLoading = true;
    this.ds.getBarangayPosts().subscribe(
      (posts) => {
        this.barangayPosts = posts;
        this.filteredPosts = [...posts]; // Initialize with all posts
        this.applyFilters(); // Apply any active filters
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );
  }

  filteredPosts: any[] = []; // Posts after search/filter
  searchText: string = ''; // Search text
  currentPage = 1;
  itemsPerPage = 10;

  applyFilters(): void {
    this.filteredPosts = this.barangayPosts.filter(post =>
      post.caption.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.currentPage = 1; // Reset to first page on new search
    this.cdr.detectChanges(); // Ensure UI updates
  }

  // Pagination Logic
  get paginatedPosts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPosts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
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

  viewPost(id: number) {
    const dialogRef = this.dialog.open(ViewBrgypostComponent, {
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchBarangayPosts();
      }
    });
  }

  formatContent(content: string | null): string {
    if (!content) {
      return 'N/A';
    }
    return content.replace(/\n/g, '<br>');
  }
}
