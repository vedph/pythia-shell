import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

import { DataPage, EnvService } from '@myrmidon/ngx-tools';

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
    // the root always is a mock node
    if (filter.parentId === undefined || filter.parentId === null) {
      const page: DataPage<TreeNode> = {
        items: [
          {
            id: 0,
            y: 0,
            x: 1,
            label: $localize`INDEX`,
            hasChildren: true,
          } as TreeNode,
        ],
        pageNumber: 1,
        pageSize: 1,
        pageCount: 1,
        total: 1,
      };
      return of(page);
    }

    const skip = (pageNumber - 1) * pageSize;

    // lemmata:
    // - mock root node (Y=0, ID=0)
    //   - lemma (Y=1, parentId=0; ID=-lemmaId to avoid clash with word IDs)
    //     - word (Y=2, lemmaId=parentId)
    if (this.hasLemmata) {
      // if parent is root, we're targeting lemmata
      if (filter.parentId === 0) {
        return this._wordService.getLemmata(filter, pageNumber, pageSize).pipe(
          map((page) => ({
            ...page,
            items: page.items.map((l, i) => ({
              id: -l.id,
              parentId: 0,
              y: 1,
              x: i + 1 + skip,
              label: l.value,
              hasChildren: true,
              token: l,
            })),
          }))
        );
      } else {
        // else we're targeting words
        filter.lemmaId = Math.abs(filter.parentId);
        filter.parentId = Math.abs(filter.parentId);
        return this._wordService.getWords(filter, pageNumber, pageSize).pipe(
          map((page) => ({
            ...page,
            items: page.items.map((w, i) => ({
              parentId: -filter.parentId!,
              id: w.id,
              y: 2,
              x: i + 1 + skip,
              label: w.value,
              hasChildren: false,
              token: w,
            })),
          }))
        );
      }
    } else {
      // words:
      // - mock root node (Y=0, ID=0)
      //   - word (Y=1, parentId=0)
      return this._wordService.getWords(filter, pageNumber, pageSize).pipe(
        map((page) => ({
          ...page,
          items: page.items.map((w, i) => ({
            parentId: filter.parentId,
            id: w.id,
            y: 2,
            x: i + 1 + skip,
            label: w.value,
            hasChildren: false,
            token: w,
          })),
        }))
      );
    }
  }
}
