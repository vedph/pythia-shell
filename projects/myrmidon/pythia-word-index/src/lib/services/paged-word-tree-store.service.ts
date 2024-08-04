import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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

  public getNodes(
    filter: WordFilter,
    pageNumber: number,
    pageSize: number
  ): Observable<DataPage<TreeNode>> {
    // TODO mock root node
    if (this.hasLemmata && !filter.parentId) {
      return this._wordService.getLemmata(filter, pageNumber, pageSize).pipe(
        map((page) => ({
          ...page,
          items: page.items.map((l, i) => ({
            id: l.id,
            y: 1,
            x: i + 1,
            label: l.value,
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
            hasChildren: false,
            token: w,
          })),
        }))
      );
    }
  }
}
