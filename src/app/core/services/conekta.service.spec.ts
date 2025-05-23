import { TestBed } from '@angular/core/testing';

import { ConektaService } from './conekta.service';

describe('ConektaService', () => {
  let service: ConektaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConektaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
