import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTriviaComponent } from './view-trivia.component';

describe('ViewTriviaComponent', () => {
  let component: ViewTriviaComponent;
  let fixture: ComponentFixture<ViewTriviaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewTriviaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewTriviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
