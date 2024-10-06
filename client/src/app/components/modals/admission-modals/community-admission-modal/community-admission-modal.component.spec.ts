import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityAdmissionModalComponent } from './community-admission-modal.component';

describe('CommunityAdmissionModalComponent', () => {
  let component: CommunityAdmissionModalComponent;
  let fixture: ComponentFixture<CommunityAdmissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityAdmissionModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunityAdmissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
