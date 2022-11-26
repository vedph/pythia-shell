import { Injectable } from '@angular/core';
import { combineLatest, debounceTime, map, Observable, take } from 'rxjs';

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
import { createStore, select, setProp, withProps } from '@ngneat/elf';
import {
  withEntities,
  withActiveId,
  selectActiveEntity,
  deleteAllEntities,
  upsertEntities,
} from '@ngneat/elf-entities';

import { DataPage } from '@myrmidon/ng-tools';
import { KwicSearchResult, SearchService } from '@myrmidon/pythia-api';
import { DocumentReadRequest } from '@myrmidon/pythia-core';
import { BehaviorSubject } from 'rxjs';

export interface IdKwicSearchResult extends KwicSearchResult {
  // ID for local store entities, built from document ID and position
  id: string;
}

const PAGE_SIZE = 20;

export interface SearchProps {
  query?: string;
  lastQueries: string[];
  error?: string;
  readRequest?: DocumentReadRequest;
}

@Injectable({ providedIn: 'root' })
export class SearchRepository {
  private _store;
  private _loading$: BehaviorSubject<boolean>;
  private _lastPageSize: number;

  public activeResult$: Observable<IdKwicSearchResult | undefined>;
  public query$: Observable<string | undefined>;
  public lastQueries$: Observable<string[]>;
  public pagination$: Observable<
    PaginationData & { data: IdKwicSearchResult[] }
  >;
  public status$: Observable<StatusState>;
  public loading$: Observable<boolean>;
  public readRequest$: Observable<DocumentReadRequest | undefined>;

  constructor(private _searchService: SearchService) {
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
    this._loading$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this._loading$.asObservable();
    this.readRequest$ = this._store.pipe(select((state) => state.readRequest));

    // the active result, if required
    this.activeResult$ = this._store.pipe(selectActiveEntity());
    // the filter, if required
    this.query$ = this._store.pipe(select((state) => state.query));
    this.lastQueries$ = this._store.pipe(select((state) => state.lastQueries));
    this.query$.subscribe((query) => {
      // when query changed, reset any existing page and move to page 1
      const paginationData = this._store.getValue().pagination;
      console.log('Deleting all pages');
      this._store.update(deleteAllPages());
      // load page 1
      this.search(query!, 5, 1, paginationData.perPage);
    });

    // the request status
    this.status$ = this._store.pipe(selectRequestStatus('search'));

    // subscribe to pagination
    this.pagination$.subscribe(console.log);
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: 'search' },
      withProps<SearchProps>({
        lastQueries: [],
      }),
      // should you have an id property different from 'id'
      // use like withEntities<User, 'userName'>({ idKey: 'userName' })
      withEntities<IdKwicSearchResult>(),
      withActiveId(),
      withRequestsCache<'search'>(),
      withRequestsStatus(),
      withPagination()
    );

    return store;
  }

  private adaptPage(
    page: DataPage<KwicSearchResult>
  ): PaginationData & { data: IdKwicSearchResult[] } {
    // adapt the server page DataPage<T> to Elf pagination
    return {
      currentPage: page.pageNumber,
      perPage: page.pageSize,
      lastPage: page.pageCount,
      total: page.total,
      data: page.items.map((item) => {
        return {
          ...item,
          id: item.documentId + '.' + item.position,
        };
      }),
    };
  }

  private addPage(
    response: PaginationData & { data: IdKwicSearchResult[] }
  ): void {
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

  public search(
    query: string | null | undefined,
    contextSize = 5,
    pageNumber = 1,
    pageSize = 20
  ): void {
    if (!query) {
      query = this._store.query((state) => state.query);
      if (!query) {
        return;
      }
    }
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
    this._store.update(updateRequestStatus('search', 'pending'));
    this._searchService
      .search(query, contextSize, pageNumber, pageSize)
      .pipe(take(1))
      .subscribe((result) => {
        if (result.error) {
          console.error(result.error);
        } else {
          this.addPage({
            ...this.adaptPage(result.value!),
            data: result.value!.items as IdKwicSearchResult[],
          });
          this._store.update(updateRequestStatus('search', 'success'));
        }
      });
  }

  public setQuery(query: string): void {
    this._store.update(setProp('query', query));
  }

  clearCache() {
    this._store.update(deleteAllEntities(), deleteAllPages());
  }

  public addToHistory(query: string): void {
    const queries = [...this._store.query((state) => state.lastQueries)];
    if (queries.indexOf(query) > -1) {
      return;
    }
    queries.splice(0, 0, query);
    this._store.update(setProp('lastQueries', queries));
  }

  public setReadRequest(request: DocumentReadRequest | undefined): void {
    this._store.update(setProp('readRequest', request));
  }
}
