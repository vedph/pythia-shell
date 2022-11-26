import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import {
  ErrorService,
  EnvService,
  DataPage,
  ErrorWrapper,
} from '@myrmidon/ng-tools';

export interface SearchResult {
  documentId: number;
  position: number;
  index: number;
  length: number;
  entityType: string;
  entityId: number;
  value: string;
  author: string;
  title: string;
  sortKey: string;
}

export interface KwicSearchResult extends SearchResult {
  leftContext: string[];
  rightContext: string[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Performs a search.
   *
   * @param query The query.
   * @returns Observable with ResultWrapper and a page of results, or
   * an error message in case of syntax errors.
   */
  public search(
    query: string,
    contextSize = 5,
    pageNumber = 1,
    pageSize = 20
  ): Observable<ErrorWrapper<DataPage<KwicSearchResult>>> {
    // empty result set for invalid search parameters
    if (pageNumber < 1 || pageSize < 1 || !query) {
      const w: ErrorWrapper<DataPage<KwicSearchResult>> = {
        value: {
          items: [],
          pageNumber: pageNumber,
          pageSize: pageSize,
          pageCount: 0,
          total: 0,
        },
      };
      return of(w);
    }

    return this._http
      .post<ErrorWrapper<DataPage<KwicSearchResult>>>(
        this._env.get('apiUrl') + 'search',
        {
          query,
          contextSize,
        }
      )
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
