import { Injectable } from '@angular/core';
import { PagedTreeStore } from '@myrmidon/paged-data-browsers';
import { WordFilter, WordService } from '@myrmidon/pythia-api';
import {
  PagedWordTreeNode,
  PagedWordTreeStoreService,
} from './paged-word-tree-store.service';
import { EnvService } from '@myrmidon/ngx-tools';

@Injectable({
  providedIn: 'root',
})
export class PagedWordTreeBrowserService {
  public readonly store: PagedTreeStore<PagedWordTreeNode, WordFilter>;

  constructor(wordService: WordService, env: EnvService) {
    this.store = new PagedTreeStore<PagedWordTreeNode, WordFilter>(
      new PagedWordTreeStoreService(wordService, env)
    );
  }
}
