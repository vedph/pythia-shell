import { Injectable } from '@angular/core';
import { DataPage } from '@myrmidon/ng-tools';

// https://github.com/Myrmex/ngx-data-browser?tab=readme-ov-file#tree
import {
  PagedTreeStoreService,
  TreeNode,
  TreeNodeFilter,
} from '@myrmidon/paged-data-browsers';
import { Lemma, Word, WordFilter } from '@myrmidon/pythia-api';
import { Observable } from 'rxjs';

/**
 * A tree node with a word or lemma token, using a LemmaFilter or WordFilter.
 */
export interface PagedWordTreeNode<WordFilter> {
  token: Lemma | Word;
}

@Injectable({
  providedIn: 'root',
})
export class PagedWordTreeStoreService
  implements PagedTreeStoreService<WordFilter>
{
  constructor() {}

  public getRootNodes(tags?: string[]): Observable<TreeNode[]> {
    // TODO
    throw new Error('Method not implemented.');
  }

  public getNodes(
    filter: WordFilter,
    pageNumber: number,
    pageSize: number
  ): Observable<DataPage<TreeNode>> {
    // TODO
    throw new Error('Method not implemented.');
  }

  public getTags(): Observable<string[]> {
    // TODO
    throw new Error('Method not implemented.');
  }
}
