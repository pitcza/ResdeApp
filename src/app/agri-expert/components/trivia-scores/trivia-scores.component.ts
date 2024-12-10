import { Component, Input, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-trivia-scores',
  templateUrl: './trivia-scores.component.html',
  styleUrls: ['./trivia-scores.component.scss']
})
export class TriviaScoresComponent implements OnInit {
  @Input() scores: TriviaScore[] = [];

  displayedColumns: string[] = ['username', 'triviaId', 'question', 'score'];
  filteredScores: TriviaScore[] = [];
  uniqueUsers: string[] = [];

  ngOnInit() {
    this.filteredScores = this.scores;
    this.uniqueUsers = [...new Set(this.scores.map(score => score.username))];
  }

  filterScores(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filteredScores = value ? this.scores.filter(score => score.username === value) : this.scores;
  }
}

export interface TriviaScore {
  username: string;
  triviaId: number;
  question: string;
  correct: boolean;
}
