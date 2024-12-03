import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, tap, map } from 'rxjs';

import { DataPage } from '@myrmidon/ngx-tools';
import { KwicSearchResult, SearchService } from '@myrmidon/pythia-api';
import { DocumentReadRequest } from '@myrmidon/pythia-core';
import {
  PagedListStore,
  PagedListStoreService,
} from '@myrmidon/paged-data-browsers';

export interface KwicSearchFilter {
  query?: string;
  contextSize?: number; // default is 5
}

@Injectable({ providedIn: 'root' })
export class SearchRepository
  implements PagedListStoreService<KwicSearchFilter, KwicSearchResult>
{
  private readonly _store: PagedListStore<KwicSearchFilter, KwicSearchResult>;
  private readonly _query$: BehaviorSubject<string | undefined>;
  private readonly _prevQuery$: BehaviorSubject<string | undefined>;
  private readonly _lastQueries$: BehaviorSubject<string[]>;
  private readonly _error$: BehaviorSubject<string | undefined>;
  private readonly _readRequest$: BehaviorSubject<
    DocumentReadRequest | undefined
  >;
  private readonly _loading$: BehaviorSubject<boolean>;

  public get query$(): Observable<string | undefined> {
    return this._query$.asObservable();
  }
  public get prevQuery$(): Observable<string | undefined> {
    return this._prevQuery$.asObservable();
  }
  public get lastQueries$(): Observable<string[]> {
    return this._lastQueries$.asObservable();
  }
  public get page$(): Observable<DataPage<KwicSearchResult> | undefined> {
    return this._store.page$;
  }
  public get error$(): Observable<string | undefined> {
    return this._error$.asObservable();
  }
  public get readRequest$(): Observable<DocumentReadRequest | undefined> {
    return this._readRequest$.asObservable();
  }
  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  constructor(private _searchService: SearchService) {
    this._store = new PagedListStore<any, KwicSearchResult>(this);
    this._query$ = new BehaviorSubject<string | undefined>(undefined);
    this._prevQuery$ = new BehaviorSubject<string | undefined>(undefined);
    this._lastQueries$ = new BehaviorSubject<string[]>([]);
    this._error$ = new BehaviorSubject<string | undefined>(undefined);
    this._readRequest$ = new BehaviorSubject<DocumentReadRequest | undefined>(
      undefined
    );
    this._loading$ = new BehaviorSubject<boolean>(false);
  }

  public loadPage(
    pageNumber: number,
    pageSize: number,
    filter: KwicSearchFilter
  ): Observable<DataPage<KwicSearchResult>> {
    if (!filter.contextSize) {
      filter.contextSize = 5;
    }
    let query = filter.query;
    if (!query) {
      query = this._prevQuery$.value;
      if (!query) {
        console.warn('No query');
        return of({
          items: [],
          pageNumber: 1,
          pageSize: 0,
          pageCount: 0,
          total: 0,
        } as DataPage<KwicSearchResult>);
      }
    }

    // load page from server
    this._loading$.next(true);
    this._error$.next(undefined);
    return this._searchService
      .search(query, filter.contextSize, pageNumber, pageSize)
      .pipe(
        tap(() => {
          this._loading$.next(false);
        }),
        map((r) => {
          this._query$.next(query);
          this._prevQuery$.next(query);
          if (r.error) {
            this._error$.next(r.error);
            return {
              items: [],
              pageNumber: 1,
              pageSize: 0,
              pageCount: 0,
              total: 0,
            } as DataPage<KwicSearchResult>;
          } else {
            return r.value!;
          }
        })
      );
  }

  public reset(): void {
    this._store.reset();
  }

  public clear(): void {
    this._store.clear();
    this._prevQuery$.next(this._query$.value);
    this._query$.next(undefined);
    this._readRequest$.next(undefined);
    this._error$.next(undefined);
  }

  public setFilter(filter: KwicSearchFilter): void {
    this._store.setFilter(filter);
  }

  public setPage(pageNumber: number, pageSize: number): void {
    this._store.setPage(pageNumber, pageSize);
  }

  public addToHistory(query: string): void {
    const queries = [...this._lastQueries$.value];
    if (queries.indexOf(query) > -1) {
      return;
    }
    queries.splice(0, 0, query);
    this._lastQueries$.next(queries);
  }

  public setReadRequest(request: DocumentReadRequest | undefined): void {
    this._readRequest$.next(request);
  }
}
