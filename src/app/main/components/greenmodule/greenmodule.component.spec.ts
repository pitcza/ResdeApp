import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenmoduleComponent } from './greenmodule.component';

describe('GreenmoduleComponent', () => {
  let component: GreenmoduleComponent;
  let fixture: ComponentFixture<GreenmoduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GreenmoduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GreenmoduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
