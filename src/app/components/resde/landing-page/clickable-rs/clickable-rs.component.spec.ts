import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickableRsComponent } from './clickable-rs.component';

describe('ClickableRsComponent', () => {
  let component: ClickableRsComponent;
  let fixture: ComponentFixture<ClickableRsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClickableRsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClickableRsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
