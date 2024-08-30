import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderCardComponent } from './uploader-card.component';

describe('UploaderCardComponent', () => {
  let component: UploaderCardComponent;
  let fixture: ComponentFixture<UploaderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploaderCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploaderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
