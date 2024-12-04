import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnnouncemComponent } from './view-announcem.component';

describe('ViewAnnouncemComponent', () => {
  let component: ViewAnnouncemComponent;
  let fixture: ComponentFixture<ViewAnnouncemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAnnouncemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAnnouncemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
