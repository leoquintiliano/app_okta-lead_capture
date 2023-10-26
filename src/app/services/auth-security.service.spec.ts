import { TestBed } from '@angular/core/testing';

import { AuthSecurityService } from './auth-security.service';

describe('AuthSecurityService', () => {
  let service: AuthSecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
