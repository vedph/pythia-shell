import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { DataPage, EnvService } from '@myrmidon/ng-tools';

// https://github.com/Myrmex/ngx-data-browser?tab=readme-ov-file#tree
import {
  PagedTreeNode,
  PagedTreeStoreService,
  TreeNode,
} from '@myrmidon/paged-data-browsers';
import { Lemma, Word, WordFilter, WordService } from '@myrmidon/pythia-api';

/**
 * A tree node with a word or lemma token, using a LemmaFilter or WordFilter.
 */
export interface PagedWordTreeNode extends PagedTreeNode<WordFilter> {
  token: Lemma | Word;
}

/**
 * The tag used to represent the tree of lemmata or words. This tree has
 * either 1 or 2 levels according to the hasLemmata property.
 * When hasLemmata is true, the first level is the lemmata and the second
 * level is the words. When hasLemmata is false, there is only the first
 * level for words. Words have their parent ID equal to the ID of their
 * lemma.
 */
export const TREE_TAG = 'tokens';

@Injectable({
  providedIn: 'root',
})
export class PagedWordTreeStoreService
  implements PagedTreeStoreService<WordFilter>
{
  /**
   * Whether the tree root nodes are lemmata or just words.
   */
  public readonly hasLemmata: boolean;

  constructor(private _wordService: WordService, env: EnvService) {
    this.hasLemmata = env.get('hasLemmata', 'false') === 'true';
  }

  public getRootNodes(tags?: string[]): Observable<TreeNode[]> {
    // when lemmata are present, the first page of lemmata
    // is the root nodes page
    if (this.hasLemmata) {
      return this._wordService.getLemmata({}).pipe(
        map((page) =>
          page.items.map((l, i) => ({
            id: l.id,
            y: 1,
            x: i + 1,
            label: l.value,
            tag: TREE_TAG,
            hasChildren: true,
            token: l,
          }))
        )
      );
    } else {
      // else the first page of words is the root nodes page
      return this._wordService.getWords({}).pipe(
        map((page) =>
          page.items.map((w, i) => ({
            id: w.id,
            y: 1,
            x: i + 1,
            label: w.value,
            tag: TREE_TAG,
            hasChildren: false,
            token: w,
          }))
        )
      );
    }
  }

  public getNodes(
    filter: WordFilter,
    pageNumber: number,
    pageSize: number
  ): Observable<DataPage<TreeNode>> {
    if (this.hasLemmata && !filter.parentId) {
      return this._wordService.getLemmata(filter, pageNumber, pageSize).pipe(
        map((page) => ({
          ...page,
          items: page.items.map((l, i) => ({
            id: l.id,
            y: 1,
            x: i + 1,
            label: l.value,
            tag: TREE_TAG,
            hasChildren: true,
            token: l,
          })),
        }))
      );
    } else {
      return this._wordService.getWords(filter, pageNumber, pageSize).pipe(
        map((page) => ({
          ...page,
          items: page.items.map((w, i) => ({
            parentId: filter.parentId,
            id: w.id,
            y: 2,
            x: i + 1,
            label: w.value,
            tag: TREE_TAG,
            hasChildren: false,
            token: w,
          })),
        }))
      );
    }
  }

  public getTags(): Observable<string[]> {
    return of([TREE_TAG]);
  }
}
