import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLatestComponent } from './edit-latest.component';

describe('EditLatestComponent', () => {
  let component: EditLatestComponent;
  let fixture: ComponentFixture<EditLatestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLatestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
