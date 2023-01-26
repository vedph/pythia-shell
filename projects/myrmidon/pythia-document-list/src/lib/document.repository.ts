import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
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
  addEntities,
  updateEntities,
  deleteEntities,
  withActiveId,
  selectActiveEntity,
  setActiveId,
  setEntities,
  upsertEntities,
  deleteAllEntities,
  resetActiveId,
} from '@ngneat/elf-entities';
import {
  withRequestsCache,
  withRequestsStatus,
  updateRequestStatus,
  selectRequestStatus,
  StatusState,
} from '@ngneat/elf-requests';
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

import { Document } from '@myrmidon/pythia-core';
import {
  AttributeService,
  DocumentFilter,
  DocumentService,
  ProfileService,
} from '@myrmidon/pythia-api';
import { DataPage } from '@myrmidon/ng-tools';

const PAGE_SIZE = 20;

export interface DocumentProps {
  filter: DocumentFilter;
  attributes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DocumentRepository {
  private _store;
  private _lastPageSize: number;
  private _loading$: BehaviorSubject<boolean>;

  public activeDocument$: Observable<Document | undefined>;
  public filter$: Observable<DocumentFilter>;
  public pagination$: Observable<PaginationData & { data: Document[] }>;
  public attributes$: Observable<string[]>;
  public status$: Observable<StatusState>;
  public loading$: Observable<boolean>;

  constructor(
    private _docService: DocumentService,
    private _attrService: AttributeService,
    private _profileService: ProfileService
  ) {
    this._store = this.createStore();
    this._lastPageSize = PAGE_SIZE;

    this.pagination$ = combineLatest([
      this._store.pipe(selectPaginationData()),
      this._store.pipe(selectCurrentPageEntities()),
    ]).pipe(
      map(([pagination, data]) => ({ ...pagination, data })),
      debounceTime(0)
    );

    this.activeDocument$ = this._store.pipe(selectActiveEntity());
    this.attributes$ = this._store.pipe(select((state) => state.attributes));
    this.status$ = this._store.pipe(selectRequestStatus('document'));
    this._loading$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this._loading$.asObservable();

    this.filter$ = this._store.pipe(select((state) => state.filter));
    this.filter$.subscribe((filter) => {
      // when filter changed, reset any existing page and move to page 1
      const paginationData = this._store.getValue().pagination;
      console.log('Deleting all pages');
      this._store.update(deleteAllPages());
      // load page 1
      this.loadPage(1, paginationData.perPage);
    });

    this.loadPage(1, PAGE_SIZE);
    this.pagination$.subscribe(console.log);
  }

  private createStore(): typeof store {
    const store = createStore(
      { name: 'document' },
      withProps<DocumentProps>({
        filter: {},
        attributes: [],
      }),
      withEntities<Document>(),
      withActiveId(),
      withRequestsCache<'document'>(),
      withRequestsStatus(),
      withPagination()
    );

    return store;
  }

  public setDocuments(response: PaginationData & { data: Document[] }) {
    const { data, ...paginationData } = response;

    this._store.update(
      setEntities(data),
      // update pagination
      updatePaginationData(paginationData),
      // set page IDs
      setPage(
        paginationData.currentPage,
        data.map((d) => d.id)
      )
    );
  }

  public setFilter(filter: DocumentFilter): void {
    this._store.update((state) => ({ ...state, filter: filter }));
  }

  public getFilter(): DocumentFilter {
    return this._store.query((state) => state.filter);
  }

  public addDocument(document: Document) {
    this._store.update(addEntities(document));
  }

  public updateDocument(id: Document['id'], document: Partial<Document>) {
    this._store.update(updateEntities(id, document));
  }

  public deleteDocument(id: Document['id']) {
    this._store.update(deleteEntities(id));
  }

  public setActiveDocumentId(id: Document['id']) {
    this._store.update(setActiveId(id));
  }

  public resetActiveDocumentId() {
    this._store.update(resetActiveId());
  }

  public updatePagination(paginationData: PaginationData): void {
    this._store.update(updatePaginationData(paginationData));
  }

  private adaptPage(
    page: DataPage<Document>
  ): PaginationData & { data: Document[] } {
    return {
      currentPage: page.pageNumber,
      perPage: page.pageSize,
      lastPage: page.pageCount,
      total: page.total,
      data: page.items,
    };
  }

  private addPage(response: PaginationData & { data: Document[] }): void {
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
    if (
      this._store.query(hasPage(pageNumber)) &&
      pageSize === this._lastPageSize
    ) {
      console.log('Page exists: ' + pageNumber);
      this._store.update(setCurrentPage(pageNumber));
      return;
    }

    if (this._lastPageSize !== pageSize) {
      this._store.update(deleteAllPages());
      this._lastPageSize = pageSize;
    }

    this._store.update(updateRequestStatus('document', 'pending'));
    this._docService
      .getDocuments(this._store.getValue().filter, pageNumber, pageSize)
      .pipe(take(1))
      .subscribe((page) => {
        this.addPage({ ...this.adaptPage(page), data: page.items });
        this._store.update(updateRequestStatus('document', 'success'));
      });
  }

  clearCache() {
    this._store.update(deleteAllEntities(), deleteAllPages());
  }

  public loadLookup(profileIdPrefix?: string): void {
    this._loading$.next(true);
    forkJoin({
      attributes: this._attrService.getAttributeNames({
        pageNumber: 1,
        pageSize: 0,
        type: 0,
      }),
      profiles: this._profileService.getProfiles(
        {
          prefix: profileIdPrefix,
        },
        1,
        0,
        true
      ),
    })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this._loading$.next(false);
          this._store.update((state) => ({
            ...state,
            attributes: result.attributes.items,
            profileIds: result.profiles.items.map((p) => p.id),
          }));
        },
        error: (error) => {
          this._loading$.next(false);
          console.error(
            'Error loading document list lookup: ' +
              (error ? JSON.stringify(error) : '')
          );
        },
      });
  }

  public loadDocumentAttributes(id: number, activate = true): void {
    this._docService
      .getDocument(id, false)
      .pipe(take(1))
      .subscribe((d) => {
        this.updateDocument(id, d);
        if (activate) {
          this.setActiveDocumentId(id);
        }
      });
  }
}
