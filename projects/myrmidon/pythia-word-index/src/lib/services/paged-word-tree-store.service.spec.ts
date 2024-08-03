import { TestBed } from '@angular/core/testing';

import { PagedWordTreeStoreService } from './paged-word-tree-store.service';

describe('PagedWordTreeStoreService', () => {
  let service: PagedWordTreeStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagedWordTreeStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
