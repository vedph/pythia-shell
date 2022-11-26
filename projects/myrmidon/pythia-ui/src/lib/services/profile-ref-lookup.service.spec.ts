import { TestBed } from '@angular/core/testing';

import { ProfileRefLookupService } from './profile-ref-lookup.service';

describe('ProfileRefLookupService', () => {
  let service: ProfileRefLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileRefLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
