import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaScoresComponent } from './trivia-scores.component';

describe('TriviaScoresComponent', () => {
  let component: TriviaScoresComponent;
  let fixture: ComponentFixture<TriviaScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriviaScoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriviaScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
