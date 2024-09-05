import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriExpertComponent } from './agri-expert.component';

describe('AgriExpertComponent', () => {
  let component: AgriExpertComponent;
  let fixture: ComponentFixture<AgriExpertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgriExpertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgriExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
