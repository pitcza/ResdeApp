import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatetriviaComponent } from './createtrivia.component';

describe('CreatetriviaComponent', () => {
  let component: CreatetriviaComponent;
  let fixture: ComponentFixture<CreatetriviaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatetriviaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatetriviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
