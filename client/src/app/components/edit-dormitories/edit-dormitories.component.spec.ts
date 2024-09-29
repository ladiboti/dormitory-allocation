import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDormitoriesComponent } from './edit-dormitories.component';

describe('EditDormitoriesComponent', () => {
  let component: EditDormitoriesComponent;
  let fixture: ComponentFixture<EditDormitoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDormitoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDormitoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
