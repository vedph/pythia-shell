import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, take, tap } from 'rxjs';

import { Document } from '@myrmidon/pythia-core';
import {
  AttributeService,
  DocumentFilter,
  DocumentService,
  ProfileService,
} from '@myrmidon/pythia-api';
import { DataPage } from '@myrmidon/ngx-tools';
import {
  PagedListStore,
  PagedListStoreService,
} from '@myrmidon/paged-data-browsers';

@Injectable({
  providedIn: 'root',
})
export class DocumentRepository
  implements PagedListStoreService<DocumentFilter, Document>
{
  private _store: PagedListStore<DocumentFilter, Document>;
  private _activeDocument$: BehaviorSubject<Document | undefined>;
  private _attributes$: BehaviorSubject<string[]>;
  private _profileIds$: BehaviorSubject<string[]>;
  private _loading$: BehaviorSubject<boolean>;

  public get page$(): Observable<DataPage<Document>> {
    return this._store.page$;
  }

  public get filter$(): Observable<DocumentFilter> {
    return this._store.filter$;
  }

  /**
   * The optional active document.
   */
  public get activeDocument$(): Observable<Document | undefined> {
    return this._activeDocument$.asObservable();
  }

  /**
   * The list of unique document attributes.
   */
  public get attributes$(): Observable<string[]> {
    return this._attributes$.asObservable();
  }

  /**
   * The list of unique profile ids.
   */
  public get profileIds$(): Observable<string[]> {
    return this._profileIds$.asObservable();
  }

  /**
   * True when the repository is loading data.
   */
  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  constructor(
    private _docService: DocumentService,
    private _attrService: AttributeService,
    private _profileService: ProfileService
  ) {
    this._store = new PagedListStore<DocumentFilter, Document>(this);
    this._activeDocument$ = new BehaviorSubject<Document | undefined>(
      undefined
    );
    this._attributes$ = new BehaviorSubject<string[]>([]);
    this._profileIds$ = new BehaviorSubject<string[]>([]);
    this._loading$ = new BehaviorSubject<boolean>(false);

    this.loadLookup();
    this._store.reset();
  }

  public loadPage(
    pageNumber: number,
    pageSize: number,
    filter: DocumentFilter
  ): Observable<DataPage<Document>> {
    this._loading$.next(true);
    return this._docService.getDocuments(filter, pageNumber, pageSize).pipe(
      tap({
        next: () => this._loading$.next(false),
        error: () => this._loading$.next(false),
      })
    );
  }

  public async reset(): Promise<void> {
    this._loading$.next(true);
    try {
      await this._store.reset();
    } catch (error) {
      throw error;
    } finally {
      this._loading$.next(false);
    }
  }

  public async setFilter(filter: DocumentFilter): Promise<void> {
    this._loading$.next(true);
    try {
      await this._store.setFilter(filter);
    } catch (error) {
      throw error;
    } finally {
      this._loading$.next(false);
    }
  }

  public getFilter(): DocumentFilter {
    return this._store.getFilter();
  }

  public async setPage(pageNumber: number, pageSize: number): Promise<void> {
    this._loading$.next(true);
    try {
      await this._store.setPage(pageNumber, pageSize);
    } catch (error) {
      throw error;
    } finally {
      this._loading$.next(false);
    }
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
          this._attributes$.next(result.attributes.items);
          this._profileIds$.next(result.profiles.items.map((p) => p.id));
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

  public setActiveDocument(id: number | null): void {
    if (!id) {
      this._activeDocument$.next(undefined);
      return;
    }
    this._loading$.next(true);
    this._docService.getDocument(id, false).subscribe({
      next: (d) => {
        this._activeDocument$.next(d);
        this._loading$.next(false);
      },
      error: (error) => {
        console.error(
          'Error loading document: ' + (error ? JSON.stringify(error) : '')
        );
        this._loading$.next(false);
      },
    });
  }
}
