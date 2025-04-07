import { Component, Input, OnInit } from '@angular/core';
import { AdminDataService } from '../../../services/admin-data.service';

@Component({
  selector: 'app-trivia-scores',
  templateUrl: './trivia-scores.component.html',
  styleUrls: ['./trivia-scores.component.scss']
})
export class TriviaScoresComponent implements OnInit {
  allScores: any[] = [];
  filteredScores: any[] = [];
  searchText: string = '';
  selectedScore: string = '';
  uniqueScores: number[] = [];

  displayedColumns: string[] = ['username', 'correct', 'wrong', 'total', 'phone', 'email'];

  constructor(private as: AdminDataService) {}

  ngOnInit() {
    this.as.userScores().subscribe({
      next: (res) => {
        this.allScores = res.users.map((u: any) => ({
          user_id: u.user_id,
          user_name: u.full_name,
          correct: u.correct_answers,
          wrong: u.wrong_answers,
          total: u.total_answers,
          phone: u.phone_number,
          email: u.email
        }));

        this.filteredScores = [...this.allScores];

        this.uniqueScores = [...new Set(this.allScores.map(u => u.correct))].sort((a, b) => b - a);
      },
      error: (err) => {
        console.error('Failed to load scores', err);
      }
    });
  }

  applyFilters(): void {
    this.filteredScores = this.allScores.filter(user => {
      const matchesSearch = (
        user.user_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.phone.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchText.toLowerCase())
      );

      const matchesScore = this.selectedScore === '' || user.correct == this.selectedScore;

      return matchesSearch && matchesScore;
    })
    .sort((a, b) => b.correct - a.correct);
  }
}
