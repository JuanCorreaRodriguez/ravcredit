import { TestBed } from '@angular/core/testing';

import { FirebaseCoreService } from './firebase-core.service';

describe('FirebaseCoreService', () => {
  let service: FirebaseCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
