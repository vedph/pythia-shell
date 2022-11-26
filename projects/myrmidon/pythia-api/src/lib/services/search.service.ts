import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ErrorService,
  EnvService,
  DataPage,
  ErrorWrapper,
} from '@myrmidon/ng-tools';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

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

export interface Search {
  pageNumber: number;
  pageSize: number;
  query: string;
  contextSize?: number;
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
   * @param search The search requested.
   * @returns Observable with ResultWrapper and a page of results, or
   * an error message in case of syntax errors.
   */
  public search(
    search: Search
  ): Observable<ErrorWrapper<DataPage<KwicSearchResult>>> {
    // empty result set for invalid search parameters
    if (search.pageNumber < 1 || search.pageSize < 1 || !search.query) {
      const w: ErrorWrapper<DataPage<KwicSearchResult>> = {
        value: {
          items: [],
          pageNumber: search.pageNumber,
          pageSize: search.pageSize,
          pageCount: 0,
          total: 0,
        },
      };
      return of(w);
    }

    return this._http
      .post<ErrorWrapper<DataPage<KwicSearchResult>>>(
        this._env.get('apiUrl') + 'search',
        search
      )
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
