import { TestBed } from '@angular/core/testing';

import { PagedWordTreeBrowserService } from './paged-word-tree-browser.service';

describe('PagedWordTreeBrowserService', () => {
  let service: PagedWordTreeBrowserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagedWordTreeBrowserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
