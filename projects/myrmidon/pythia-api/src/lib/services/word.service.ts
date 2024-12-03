import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry } from 'rxjs';

import { ErrorService, EnvService, DataPage } from '@myrmidon/ngx-tools';
import { TreeNodeFilter } from '@myrmidon/paged-data-browsers';

/**
 * Information about an attribute.
 */
export interface AttributeInfo {
  name: string;
  type: number;
}

/**
 * Count of occurrences for a word or lemma in a subset of documents having
 * the specified name=value attribute pair.
 */
export interface TokenCount {
  sourceId: number;
  attributeName: string;
  attributeValue: string;
  value: number;
}

/**
 * A lemma, i.e. the base word form.
 */
export interface Lemma {
  type: 'lemma' | 'word';
  id: number;
  value: string;
  reversedValue: string;
  language?: string;
  count: number;
}

/**
 * A word form.
 */
export interface Word extends Lemma {
  lemmaId?: number;
  lemma?: string;
  pos?: string;
}

/**
 * Lemma filter.
 */
export interface LemmaFilter extends TreeNodeFilter {
  language?: string;
  valuePattern?: string;
  minValueLength?: number;
  maxValueLength?: number;
  minCount?: number;
  maxCount?: number;
  sortOrder?: WordSortOrder;
  isSortDescending?: boolean;
}

/**
 * Word filter.
 */
export interface WordFilter extends LemmaFilter {
  lemmaId?: number;
  pos?: string;
}

/**
 * Word sort order.
 */
export enum WordSortOrder {
  Default = 0,
  ByValue = 1,
  ByReversedValue = 2,
  ByCount = 3,
}

/**
 * A service for working with words and lemmata.
 */
@Injectable({
  providedIn: 'root',
})
export class WordService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Get information about all the document attributes.
   *
   * @param privileged True to include privileged attributes.
   * @returns Information about document attributes.
   */
  public getDocAttributeInfo(privileged = true): Observable<AttributeInfo[]> {
    return this._http
      .get<AttributeInfo[]>(`${this._env.get('apiUrl')}words/doc-attr-info`, {
        params: new HttpParams().set('privileged', privileged.toString()),
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }

  private applyLemmaFilterParams(
    filter: LemmaFilter,
    pageNumber = 1,
    pageSize = 20,
    httpParams: HttpParams
  ): HttpParams {
    httpParams = httpParams.set('pageNumber', pageNumber.toString());
    httpParams = httpParams.set('pageSize', pageSize.toString());

    if (filter.language) {
      httpParams = httpParams.set('language', filter.language);
    }
    if (filter.valuePattern) {
      httpParams = httpParams.set('valuePattern', filter.valuePattern);
    }
    if (filter.minValueLength) {
      httpParams = httpParams.set(
        'minValueLength',
        filter.minValueLength.toString()
      );
    }
    if (filter.maxValueLength) {
      httpParams = httpParams.set(
        'maxValueLength',
        filter.maxValueLength.toString()
      );
    }
    if (filter.minCount) {
      httpParams = httpParams.set('minCount', filter.minCount.toString());
    }
    if (filter.maxCount) {
      httpParams = httpParams.set('maxCount', filter.maxCount.toString());
    }
    if (filter.sortOrder) {
      httpParams = httpParams.set('sortOrder', filter.sortOrder.toString());
    }
    if (filter.isSortDescending) {
      httpParams = httpParams.set(
        'isSortDescending',
        filter.isSortDescending.toString()
      );
    }

    return httpParams;
  }

  /**
   * Get a page of words.
   *
   * @param filter The word filter.
   * @param pageNumber The page number.
   * @param pageSize The page size.
   * @returns The page of words.
   */
  public getWords(
    filter: WordFilter,
    pageNumber = 1,
    pageSize = 20
  ): Observable<DataPage<Word>> {
    let httpParams = this.applyLemmaFilterParams(
      filter,
      pageNumber,
      pageSize,
      new HttpParams()
    );

    // add word-specific parameters
    if (filter.lemmaId) {
      httpParams = httpParams.set('lemmaId', filter.lemmaId.toString());
    }
    if (filter.pos) {
      httpParams = httpParams.set('pos', filter.pos);
    }

    return this._http
      .get<DataPage<Word>>(`${this._env.get('apiUrl')}words`, {
        params: httpParams,
      })
      .pipe(
        map((page) => {
          page.items.forEach((word) => {
            word.type = 'word';
          });
          return page;
        }),
        retry(3),
        catchError(this._error.handleError)
      );
  }

  /**
   * Get the distribution for the specified word in documents having
   * the specified attribute(s).
   *
   * @param id The word ID.
   * @param attributes The document attribute names.
   * @returns Word counts for each attribute name and value, in a map
   * where key=attribute name and value=counts, sorted in descending order.
   */
  public getWordCounts(
    id: number,
    attributes: string[]
  ): Observable<{ [key: string]: TokenCount[] }> {
    let params = new HttpParams();
    attributes.forEach((attribute) => {
      params = params.append('attributes', attribute);
    });

    return this._http
      .get<{ [key: string]: TokenCount[] }>(
        `${this._env.get('apiUrl')}words/${id}/counts`,
        {
          params: params,
        }
      )
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get a page of lemmata.
   *
   * @param filter The lemma filter.
   * @param pageNumber The page number.
   * @param pageSize The page size.
   * @returns Page of lemmata.
   */
  public getLemmata(
    filter: LemmaFilter,
    pageNumber = 1,
    pageSize = 20
  ): Observable<DataPage<Lemma>> {
    const httpParams = this.applyLemmaFilterParams(
      filter,
      pageNumber,
      pageSize,
      new HttpParams()
    );

    return this._http
      .get<DataPage<Lemma>>(`${this._env.get('apiUrl')}lemmata`, {
        params: httpParams,
      })
      .pipe(
        map((page) => {
          page.items.forEach((lemma) => {
            lemma.type = 'lemma';
          });
          return page;
        }),
        retry(3),
        catchError(this._error.handleError)
      );
  }

  /**
   * Get the distribution for the specified lemma in documents having
   * the specified attribute(s).
   *
   * @param id The lemma ID.
   * @param attributes The document attribute names.
   * @returns Lemma counts for each attribute name and value, in a map
   * where key=attribute name and value=counts, sorted in descending order.
   */
  public getLemmaCounts(
    id: number,
    attributes: string[]
  ): Observable<{ [key: string]: TokenCount[] }> {
    let params = new HttpParams();
    attributes.forEach((attribute) => {
      params = params.append('attributes', attribute);
    });

    return this._http
      .get<{ [key: string]: TokenCount[] }>(
        `${this._env.get('apiUrl')}lemmata/${id}/counts`,
        {
          params: params,
        }
      )
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
