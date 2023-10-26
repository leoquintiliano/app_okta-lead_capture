import { TestBed } from '@angular/core/testing';

import { SharingContentService } from './sharing-content.service';

describe('SharingContentService', () => {
  let service: SharingContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharingContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
