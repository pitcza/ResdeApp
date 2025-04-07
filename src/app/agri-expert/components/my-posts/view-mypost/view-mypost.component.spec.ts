import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMypostComponent } from './view-mypost.component';

describe('ViewMypostComponent', () => {
  let component: ViewMypostComponent;
  let fixture: ComponentFixture<ViewMypostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMypostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewMypostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
