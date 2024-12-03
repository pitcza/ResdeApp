import { Component, OnInit } from '@angular/core';

// Define a type for trivia questions
interface TriviaQuestion {
  title: string;
  options: string[];
  correctAnswer: number;
}

@Component({
  selector: 'app-greenmodule',
  templateUrl: './greenmodule.component.html',
  styleUrls: ['./greenmodule.component.scss']
})
export class GreenmoduleComponent implements OnInit {
  // Explicitly type the question arrays
  allQuestions: TriviaQuestion[] = [
    { title: 'What is the process by which plants make their food?', options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Germination'], correctAnswer: 1 },
    { title: 'Which part of the plant conducts photosynthesis?', options: ['Root', 'Stem', 'Leaf', 'Flower'], correctAnswer: 2 },
    { title: 'What gas do plants release during photosynthesis?', options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Methane'], correctAnswer: 2 },
    { title: 'Which part of the plant absorbs water and nutrients from the soil?', options: ['Leaf', 'Stem', 'Root', 'Flower'], correctAnswer: 2 },
    { title: 'What do you call the green pigment in plants?', options: ['Chlorophyll', 'Carotene', 'Xanthophyll', 'Anthocyanin'], correctAnswer: 0 },
    { title: 'Which plant is known as the "king of herbs"?', options: ['Basil', 'Rosemary', 'Mint', 'Oregano'], correctAnswer: 0 },
    { title: 'What type of plants grow in water?', options: ['Terrestrial', 'Aquatic', 'Epiphytes', 'Desert'], correctAnswer: 1 },
    { title: 'What is the largest flower in the world?', options: ['Sunflower', 'Rafflesia', 'Lotus', 'Orchid'], correctAnswer: 1 },
    { title: 'What do we call trees that lose their leaves annually?', options: ['Evergreen', 'Deciduous', 'Coniferous', 'Perennial'], correctAnswer: 1 },
    { title: 'Which part of the plant produces seeds?', options: ['Roots', 'Leaves', 'Stem', 'Flower'], correctAnswer: 3 }
  ];

  triviaQuestions: TriviaQuestion[] = [];
  userAnswers: number[] = [];
  showResults = false;
  score = 0;
  attempts = 0; // Counter for attempts
  maxAttempts = 3; // Maximum allowed attempts
  cooldownActive = false; // Whether the cooldown is active
  cooldownEndTime: Date | null = null;

  ngOnInit(): void {
    this.checkCooldown();
    if (!this.cooldownActive) {
      this.loadNewQuiz();
    }
  }

  checkCooldown() {
    const lastAttemptTimestamp = localStorage.getItem('triviaCooldown');
    if (lastAttemptTimestamp) {
      const lastAttemptTime = new Date(parseInt(lastAttemptTimestamp, 10));
      const now = new Date();
      const cooldownEnd = new Date(lastAttemptTime.getTime() + 24 * 60 * 60 * 1000);

      if (now < cooldownEnd) {
        this.cooldownActive = true;
        this.cooldownEndTime = cooldownEnd;
      } else {
        this.cooldownActive = false;
        localStorage.removeItem('triviaCooldown'); // Cooldown expired
      }
    }
  }

  loadNewQuiz() {
    if (this.attempts >= this.maxAttempts) {
      alert('You have reached the maximum number of attempts.');
      return;
    }

    this.attempts++;
    this.triviaQuestions = this.getRandomQuestions(5); // Get 5 random questions
    this.userAnswers = Array(this.triviaQuestions.length).fill(null); // Initialize user answers
    this.showResults = false;
    this.score = 0;
  }

  getRandomQuestions(count: number): TriviaQuestion[] {
    const availableQuestions = this.allQuestions.filter(
      question => !this.triviaQuestions.includes(question) // Exclude already used questions
    );

    // Shuffle and pick the required number of questions
    return availableQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  submitAnswers() {
    this.score = this.userAnswers.reduce((total, answer, index) => {
      return total + (answer === this.triviaQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    this.showResults = true;

    if (this.attempts >= this.maxAttempts) {
      alert('You have reached the maximum number of attempts. Please try again after 24 hours.');
      localStorage.setItem('triviaCooldown', Date.now().toString()); // Set cooldown timer
      this.cooldownActive = true;
      this.checkCooldown();
    }
  }
}
