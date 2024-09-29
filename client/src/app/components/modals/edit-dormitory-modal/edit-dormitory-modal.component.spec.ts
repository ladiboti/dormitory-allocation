import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDormitoryModalComponent } from './edit-dormitory-modal.component';

describe('EditDormitoryModalComponent', () => {
  let component: EditDormitoryModalComponent;
  let fixture: ComponentFixture<EditDormitoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDormitoryModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDormitoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
