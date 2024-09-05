import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriExpertLoginComponent } from './agri-expert-login.component';

describe('AgriExpertLoginComponent', () => {
  let component: AgriExpertLoginComponent;
  let fixture: ComponentFixture<AgriExpertLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgriExpertLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgriExpertLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
