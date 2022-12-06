import { Injectable } from '@angular/core';
import {
  combineLatest,
  debounceTime,
  forkJoin,
  map,
  Observable,
  take,
} from 'rxjs';

import { createStore, select, withProps } from '@ngneat/elf';
import {
  withEntities,
  withActiveId,
  selectActiveEntity,
  deleteAllEntities,
  upsertEntities,
} from '@ngneat/elf-entities';
import {
  deleteAllPages,
  hasPage,
  PaginationData,
  selectCurrentPageEntities,
  selectPaginationData,
  setCurrentPage,
  setPage,
  updatePaginationData,
  withPagination,
} from '@ngneat/elf-pagination';
import {
  selectRequestStatus,
  StatusState,
  updateRequestStatus,
  withRequestsCache,
  withRequestsStatus,
} from '@ngneat/elf-requests';

import { IndexTerm } from '@myrmidon/pythia-core';
import {
  AttributeFilterType,
  AttributeService,
  TermFilter,
  TermService,
} from '@myrmidon/pythia-api';
import { DataPage } from '@myrmidon/ng-tools';

const PAGE_SIZE = 20;

export interface TermListProps {
  filter: TermFilter;
  docAttributes: string[];
  tokAttributes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class TermListRepository {
  private _store;
  private _lastPageSize: number;

  public activeTerm$: Observable<IndexTerm | undefined>;
  public filter$: Observable<TermFilter>;
  public docAttributes$: Observable<string[]>;
  public tokAttributes$: Observable<string[]>;
  public pagination$: Observable<PaginationData & { data: IndexTerm[] }>;
  public status$: Observable<StatusState>;

  constructor(
    private _termService: TermService,
    private _attrService: AttributeService
  ) {
    // create store
    this._store = this.createStore();
    this._lastPageSize = PAGE_SIZE;
    // combine pagination parameters with page data for our consumers
    this.pagination$ = combineLatest([
      this._store.pipe(selectPaginationData()),
      this._store.pipe(selectCurrentPageEntities()),
    ]).pipe(
      map(([pagination, data]) => ({ ...pagination, data })),
      debounceTime(0)
    );
    // the active term, if required
    this.activeTerm$ = this._store.pipe(selectActiveEntity());
    // the filter, if required
    this.filter$ = this._store.pipe(select((state) => state.filter));
    this.docAttributes$ = this._store.pipe(
      select((state) => state.docAttributes)
    );
    this.tokAttributes$ = this._store.pipe(
      select((state) => state.tokAttributes)
    );

    this.filter$.subscribe((filter) => {
      // when filter changed, reset any existing page and move to page 1
      const paginationData = this._store.getValue().pagination;
      console.log('Deleting all pages');
      this._store.update(deleteAllPages());
      // load page 1
      this.loadPage(1, paginationData.perPage);
    });

    // the request status
    this.status$ = this._store.pipe(selectRequestStatus('term-list'));

    // load page 1 and subscribe to pagination
    this.loadPage(1, PAGE_SIZE);
    this.pagination$.subscribe(console.log);

    this.loadLookup();
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: 'term-list' },
      withProps<TermListProps>({
        filter: {},
        docAttributes: [],
        tokAttributes: [],
      }),
      // should you have an id property different from 'id'
      // use like withEntities<User, 'userName'>({ idKey: 'userName' })
      withEntities<IndexTerm>(),
      withActiveId(),
      withRequestsCache<'term-list'>(),
      withRequestsStatus(),
      withPagination()
    );

    return store;
  }

  private adaptPage(
    page: DataPage<IndexTerm>
  ): PaginationData & { data: IndexTerm[] } {
    // adapt the server page DataPage<T> to Elf pagination
    return {
      currentPage: page.pageNumber,
      perPage: page.pageSize,
      lastPage: page.pageCount,
      total: page.total,
      data: page.items,
    };
  }

  private addPage(response: PaginationData & { data: IndexTerm[] }): void {
    const { data, ...paginationData } = response;
    this._store.update(
      upsertEntities(data),
      updatePaginationData(paginationData),
      setPage(
        paginationData.currentPage,
        data.map((c) => c.id)
      )
    );
  }

  private loadLookup(): void {
    forkJoin({
      doc: this._attrService.getAttributeNames({
        pageNumber: 1,
        pageSize: 0,
        type: AttributeFilterType.Document,
      }),
      tok: this._attrService.getAttributeNames({
        pageNumber: 1,
        pageSize: 0,
        type: AttributeFilterType.Occurrence,
      }),
    })
      .pipe(take(1))
      .subscribe((result) => {
        this._store.update((state) => ({
          ...state,
          docAttributes: result.doc.items,
          tokAttributes: result.tok.items,
        }));
      });
  }

  public loadPage(pageNumber: number, pageSize?: number): void {
    if (!pageSize) {
      pageSize = PAGE_SIZE;
    }
    // if the page exists and page size is the same, just move to it
    if (
      this._store.query(hasPage(pageNumber)) &&
      pageSize === this._lastPageSize
    ) {
      console.log('Page exists: ' + pageNumber);
      this._store.update(setCurrentPage(pageNumber));
      return;
    }

    // reset cached pages if page size changed
    if (this._lastPageSize !== pageSize) {
      this._store.update(deleteAllPages());
      this._lastPageSize = pageSize;
    }

    // load page from server
    this._store.update(updateRequestStatus('term-list', 'pending'));
    this._termService
      .getTerms(this._store.getValue().filter, pageNumber, pageSize)
      .pipe(take(1))
      .subscribe((page) => {
        this.addPage({ ...this.adaptPage(page), data: page.items });
        this._store.update(updateRequestStatus('term-list', 'success'));
      });
  }

  public setFilter(filter: TermFilter): void {
    this._store.update((state) => ({ ...state, filter: filter }));
  }

  clearCache() {
    this._store.update(deleteAllEntities(), deleteAllPages());
  }
}
