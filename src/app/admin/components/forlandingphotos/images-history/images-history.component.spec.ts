import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesHistoryComponent } from './images-history.component';

describe('ImagesHistoryComponent', () => {
  let component: ImagesHistoryComponent;
  let fixture: ComponentFixture<ImagesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImagesHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
