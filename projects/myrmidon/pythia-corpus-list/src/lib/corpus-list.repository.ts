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
import { createStore, select, withProps } from '@ngneat/elf';
import {
  withEntities,
  withActiveId,
  selectActiveEntity,
  deleteAllEntities,
  upsertEntities,
  deleteEntities,
} from '@ngneat/elf-entities';

import { DataPage } from '@myrmidon/ng-tools';

import { CorpusFilter, CorpusService } from '@myrmidon/pythia-api';
import { Corpus } from '@myrmidon/pythia-core';
import { BehaviorSubject } from 'rxjs';

const PAGE_SIZE = 20;

export interface CorpusProps {
  filter: CorpusFilter;
}

@Injectable({ providedIn: 'root' })
export class CorpusListRepository {
  private _store;
  private _lastPageSize: number;
  private _saving$: BehaviorSubject<boolean>;
  private _loading$: BehaviorSubject<boolean>;

  public activeCorpus$: Observable<Corpus | undefined>;
  public saving$: Observable<boolean>;
  public loading$: Observable<boolean>;
  public filter$: Observable<CorpusFilter>;
  public pagination$: Observable<PaginationData & { data: Corpus[] }>;
  public status$: Observable<StatusState>;

  constructor(private _corpusService: CorpusService) {
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
    this._saving$ = new BehaviorSubject<boolean>(false);
    this.saving$ = this._saving$.asObservable();
    this._loading$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this._loading$.asObservable();
    // the active corpus, if required
    this.activeCorpus$ = this._store.pipe(selectActiveEntity());
    // the filter, if required
    this.filter$ = this._store.pipe(select((state) => state.filter));
    this.filter$.subscribe((filter) => {
      // when filter changed, reset any existing page and move to page 1
      const paginationData = this._store.getValue().pagination;
      console.log('Deleting all pages');
      this._store.update(deleteAllPages());
      // load page 1
      this.loadPage(1, paginationData.perPage);
    });

    // the request status
    this.status$ = this._store.pipe(selectRequestStatus('corpus-list'));

    // load page 1 and subscribe to pagination
    this.loadPage(1, PAGE_SIZE);
    this.pagination$.subscribe(console.log);
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: 'corpus-list' },
      withProps<CorpusProps>({
        filter: {},
      }),
      withEntities<Corpus>(),
      withActiveId(),
      withRequestsCache<'corpus-list'>(),
      withRequestsStatus(),
      withPagination()
    );

    return store;
  }

  private adaptPage(
    page: DataPage<Corpus>
  ): PaginationData & { data: Corpus[] } {
    // adapt the server page DataPage<T> to Elf pagination
    return {
      currentPage: page.pageNumber,
      perPage: page.pageSize,
      lastPage: page.pageCount,
      total: page.total,
      data: page.items,
    };
  }

  private addPage(response: PaginationData & { data: Corpus[] }): void {
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
    this._store.update(updateRequestStatus('corpus-list', 'pending'));
    this._loading$.next(true);
    this._corpusService
      .getCorpora(this._store.getValue().filter, pageNumber, pageSize)
      .pipe(take(1))
      .subscribe((page) => {
        this._loading$.next(false);
        this.addPage({ ...this.adaptPage(page), data: page.items });
        this._store.update(updateRequestStatus('corpus-list', 'success'));
      });
  }

  public setFilter(filter: CorpusFilter): void {
    this._store.update((state) => ({ ...state, filter: filter }));
  }

  clearCache() {
    this._store.update(deleteAllEntities(), deleteAllPages());
  }

  public deleteCorpus(id: string): void {
    this._saving$.next(true);
    this._corpusService
      .deleteCorpus(id)
      .pipe(take(1))
      .subscribe({
        next: (_) => {
          this._saving$.next(false);
          this.clearCache();
          this._store.update(deleteEntities(id));
          this.loadPage(1, PAGE_SIZE);
        },
        error: (error) => {
          this._saving$.next(false);
          console.error(
            'Error deleting corpus: ' + (error ? JSON.stringify(error) : '')
          );
        },
      });
  }

  public addCorpus(corpus: Corpus, sourceId?: string): void {
    this._saving$.next(true);
    this._corpusService
      .addCorpus(corpus, sourceId)
      .pipe(take(1))
      .subscribe({
        next: (saved) => {
          this._saving$.next(false);
          this.clearCache();
          this._store.update(upsertEntities(saved));
          this.loadPage(1, PAGE_SIZE);
        },
        error: (error) => {
          this._saving$.next(false);
          console.error(
            'Error saving corpus: ' + (error ? JSON.stringify(error) : '')
          );
        },
      });
  }
}
