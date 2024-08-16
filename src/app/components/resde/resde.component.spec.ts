import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResdeComponent } from './resde.component';

describe('ResdeComponent', () => {
  let component: ResdeComponent;
  let fixture: ComponentFixture<ResdeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResdeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
