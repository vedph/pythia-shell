import { TestBed } from '@angular/core/testing';

import { CorpusRefLookupService } from './corpus-ref-lookup.service';

describe('CorpusRefLookupService', () => {
  let service: CorpusRefLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorpusRefLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
