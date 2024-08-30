import { TestBed } from '@angular/core/testing';

import { GetStudentsService } from './get-students.service';

describe('GetStudentsService', () => {
  let service: GetStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
