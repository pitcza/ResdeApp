import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayImagesComponent } from './display-images.component';

describe('DisplayImagesComponent', () => {
  let component: DisplayImagesComponent;
  let fixture: ComponentFixture<DisplayImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayImagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplayImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
