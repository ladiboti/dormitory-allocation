import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDormitoryModalComponent } from './add-dormitory-modal.component';

describe('AddDormitoryModalComponent', () => {
  let component: AddDormitoryModalComponent;
  let fixture: ComponentFixture<AddDormitoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDormitoryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDormitoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
