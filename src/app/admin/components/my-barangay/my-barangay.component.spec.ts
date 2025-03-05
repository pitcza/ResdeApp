import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBarangayComponent } from './my-barangay.component';

describe('MyBarangayComponent', () => {
  let component: MyBarangayComponent;
  let fixture: ComponentFixture<MyBarangayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyBarangayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyBarangayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
