import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBrgypostComponent } from './view-brgypost.component';

describe('ViewBrgypostComponent', () => {
  let component: ViewBrgypostComponent;
  let fixture: ComponentFixture<ViewBrgypostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewBrgypostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBrgypostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
