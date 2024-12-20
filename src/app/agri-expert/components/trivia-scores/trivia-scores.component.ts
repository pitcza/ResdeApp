import { Component, Input, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AdminDataService } from '../../../services/admin-data.service';

@Component({
  selector: 'app-trivia-scores',
  templateUrl: './trivia-scores.component.html',
  styleUrls: ['./trivia-scores.component.scss']
})
export class TriviaScoresComponent implements OnInit {
  @Input() scores: TriviaScore[] = [];

  displayedColumns: string[] = ['username', 'triviaId', 'question', 'score'];
  dataSource: TriviaScore[] = [];
  uniqueUsers: string[] = [];

  constructor(private as: AdminDataService) {}

  ngOnInit() {
    this.fetchUserScore();
  }

  fetchUserScore() {
    this.as.userScores().subscribe(
      (response) => {
        this.scores = response?.users?.map((user: any) => ({
          user_name: user.user_name,
          triviaId: user.user_id, 
          question: 'N/A', 
          correct: user.total_score
        })) || [];

        this.dataSource = this.scores;
        this.uniqueUsers = [...new Set(this.scores.map(score => score.user_name))]; // Extract unique usernames
      },
      (error) => {
        console.error('Error fetching scores:', error);
      }
    );
  }
}

export interface TriviaScore {
  user_name: string;
  triviaId: number | string;
  question: string;
  correct: number
}
