import { TestBed } from '@angular/core/testing';

import { ClassmateService } from './classmate.service';

describe('ClassmateService', () => {
  let service: ClassmateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassmateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
