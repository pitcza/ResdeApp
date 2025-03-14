import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrieditComponent } from './agriedit.component';

describe('AgrieditComponent', () => {
  let component: AgrieditComponent;
  let fixture: ComponentFixture<AgrieditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgrieditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgrieditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
