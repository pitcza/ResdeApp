import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTriviaComponent } from './edit-trivia.component';

describe('EditTriviaComponent', () => {
  let component: EditTriviaComponent;
  let fixture: ComponentFixture<EditTriviaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTriviaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTriviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
