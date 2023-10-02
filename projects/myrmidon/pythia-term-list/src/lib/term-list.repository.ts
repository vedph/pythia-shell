import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, take, tap } from 'rxjs';

import { DataPage } from '@myrmidon/ng-tools';
import {
  PagedListStore,
  PagedListStoreService,
} from '@myrmidon/paged-data-browsers';
import { AppSettingsService, IndexTerm } from '@myrmidon/pythia-core';
import {
  AttributeFilterType,
  AttributeService,
  TermDistributionSet,
  TermFilter,
  TermService,
} from '@myrmidon/pythia-api';

export interface TermListDistributionSet {
  term: IndexTerm;
  setLimit: number;
  docAttributes: string[];
  occAttributes: string[];
  value: TermDistributionSet;
}

/**
 * Terms list repository.
 */
@Injectable({
  providedIn: 'root',
})
export class TermListRepository
  implements PagedListStoreService<TermFilter, IndexTerm>
{
  private _store: PagedListStore<TermFilter, IndexTerm>;
  private _filter$: BehaviorSubject<TermFilter>;
  private _docAttributes$: BehaviorSubject<string[]>;
  private _occAttributes$: BehaviorSubject<string[]>;
  private _termSet$: BehaviorSubject<TermListDistributionSet | undefined>;
  private _loading$: BehaviorSubject<boolean>;

  public get filter$(): Observable<TermFilter> {
    return this._filter$.asObservable();
  }
  public get docAttributes$(): Observable<string[]> {
    return this._docAttributes$.asObservable();
  }
  public get occAttributes$(): Observable<string[]> {
    return this._occAttributes$.asObservable();
  }
  public get termSet$(): Observable<TermListDistributionSet | undefined> {
    return this._termSet$.asObservable();
  }
  public get page$(): Observable<DataPage<IndexTerm>> {
    return this._store.page$;
  }
  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  constructor(
    private _termService: TermService,
    private _attrService: AttributeService,
    settings: AppSettingsService
  ) {
    this._store = new PagedListStore<TermFilter, IndexTerm>(this);
    this._filter$ = new BehaviorSubject<TermFilter>({});
    this._docAttributes$ = new BehaviorSubject<string[]>([]);
    this._occAttributes$ = new BehaviorSubject<string[]>([]);
    this._termSet$ = new BehaviorSubject<TermListDistributionSet | undefined>(
      undefined
    );
    this._loading$ = new BehaviorSubject<boolean>(false);

    this.loadLookup();
    if (
      settings.termDistrDocNames.length ||
      settings.termDistrOccNames.length
    ) {
      this.setPresetAttributes(
        settings.termDistrDocNames,
        settings.termDistrOccNames
      );
    }

    this._store.reset();
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
        this._docAttributes$.next(result.doc.items);
        this._occAttributes$.next(result.tok.items);
      });
  }

  public loadPage(
    pageNumber: number,
    pageSize: number,
    filter: TermFilter
  ): Observable<DataPage<IndexTerm>> {
    this._loading$.next(true);
    return this._termService.getTerms(filter, pageNumber, pageSize).pipe(
      tap({
        next: () => this._loading$.next(false),
        error: () => this._loading$.next(false),
      })
    );
  }

  public setPage(pageNumber: number, pageSize: number): void {
    this._store.setPage(pageNumber, pageSize);
  }

  public reset(): void {
    this._store.reset();
  }

  public setFilter(filter: TermFilter): void {
    this._store.setFilter(filter);
  }

  public setPresetAttributes(docNames: string[], occNames: string[]): void {
    this._docAttributes$.next(docNames);
    this._occAttributes$.next(occNames);
  }

  public clearCache() {
    this._store.clearCache();
  }

  public loadTermDistributionSet(
    term: IndexTerm,
    docAttributes: string[] = [],
    occAttributes: string[] = [],
    limit = 10,
    interval = 0
  ): void {
    this._loading$.next(true);

    this._termService
      .getTermDistributions({
        termId: term.id,
        limit: limit,
        interval: interval,
        docAttributes: docAttributes,
        occAttributes: occAttributes,
      })
      .subscribe({
        next: (set) => {
          this._loading$.next(false);
          this._termSet$.next({
            term: term,
            setLimit: limit,
            docAttributes: docAttributes,
            occAttributes: occAttributes,
            value: set,
          });
        },
        error: (error) => {
          this._loading$.next(false);
          console.error(
            'Error loading set: ' + (error ? JSON.stringify(error) : '')
          );
        },
      });
  }
}
