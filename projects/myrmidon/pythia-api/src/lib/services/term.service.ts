import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DataPage, EnvService, ErrorService } from '@myrmidon/ngx-tools';
import { IndexTerm } from '@myrmidon/pythia-core';

/**
 * Terms filter.
 */
export interface TermFilter {
  corpusId?: string;
  author?: string;
  title?: string;
  source?: string;
  profileId?: string;
  minDateValue?: number;
  maxDateValue?: number;
  minTimeModified?: Date;
  maxTimeModified?: Date;
  docAttributes?: string; // name=value CSV
  occAttributes?: string; // name=value CSV
  valuePattern?: string; // wildcards: ? and *
  minValueLength?: number;
  maxValueLength?: number;
  minCount?: number;
  maxCount?: number;
  sortOrder?: TermSortOrder;
  descending?: boolean;
}

/**
 * Term sort order.
 */
export enum TermSortOrder {
  Default = 0,
  ByValue,
  ByReversedValue,
  ByCount,
}

/**
 * Term distribution request.
 */
export interface TermDistributionRequest {
  termId: number;
  limit: number;
  interval?: number;
  docAttributes?: string[];
  occAttributes?: string[];
}

/**
 * Term distribution, i.e. a set of frequencies for the top values of
 * of a specific term's document or occurrence attribute.
 */
export interface TermDistribution {
  attribute: string;
  frequencies: { [key: string]: number };
}

/**
 * Term distribution set, i.e. a set of term distributions for a specific term.
 */
export interface TermDistributionSet {
  termId: number;
  termFrequency: number;
  docFrequencies: { [key: string]: TermDistribution };
  occFrequencies: { [key: string]: TermDistribution };
}

@Injectable({
  providedIn: 'root',
})
export class TermService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  public getTerms(
    filter: TermFilter,
    pageNumber = 1,
    pageSize = 20
  ): Observable<DataPage<IndexTerm>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('pageNumber', pageNumber.toString());
    httpParams = httpParams.set('pageSize', pageSize.toString());

    if (filter.corpusId) {
      httpParams = httpParams.set('corpusId', filter.corpusId);
    }
    if (filter.author) {
      httpParams = httpParams.set('author', filter.author);
    }
    if (filter.title) {
      httpParams = httpParams.set('title', filter.title);
    }
    if (filter.source) {
      httpParams = httpParams.set('source', filter.source);
    }
    if (filter.profileId) {
      httpParams = httpParams.set('profileId', filter.profileId);
    }
    if (filter.minDateValue) {
      httpParams = httpParams.set(
        'minDateValue',
        filter.minDateValue.toString()
      );
    }
    if (filter.maxDateValue) {
      httpParams = httpParams.set(
        'maxDateValue',
        filter.maxDateValue.toString()
      );
    }
    if (filter.minTimeModified) {
      httpParams = httpParams.set(
        'minTimeModified',
        filter.minTimeModified.toISOString()
      );
    }
    if (filter.maxTimeModified) {
      httpParams = httpParams.set(
        'maxTimeModified',
        filter.maxTimeModified.toISOString()
      );
    }
    if (filter.docAttributes) {
      httpParams = httpParams.set('docAttributes', filter.docAttributes);
    }
    if (filter.occAttributes) {
      httpParams = httpParams.set('occAttributes', filter.occAttributes);
    }
    if (filter.valuePattern) {
      httpParams = httpParams.set('valuePattern', filter.valuePattern);
    }
    if (filter.minValueLength) {
      httpParams = httpParams.set('minValueLength', filter.minValueLength);
    }
    if (filter.maxValueLength) {
      httpParams = httpParams.set('maxValueLength', filter.maxValueLength);
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
    if (filter.descending) {
      httpParams = httpParams.set('descending', filter.descending);
    }

    return this._http
      .get<DataPage<IndexTerm>>(this._env.get('apiUrl') + 'terms', {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }

  private addAttributesParams(
    attributes: string[],
    name: string,
    httpParams: HttpParams
  ): HttpParams {
    for (let i = 0; i < attributes.length; i++) {
      httpParams = httpParams.append(name, attributes[i]);
    }
    return httpParams;
  }

  public getTermDistributions(
    request: TermDistributionRequest
  ): Observable<TermDistributionSet> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('termId', request.termId);
    httpParams = httpParams.set('limit', request.limit);

    if (request.interval && request.interval > 1) {
      httpParams = httpParams.set('interval', request.interval);
    }

    if (request.docAttributes?.length) {
      httpParams = this.addAttributesParams(
        request.docAttributes,
        'docAttributes',
        httpParams
      );
    }

    if (request.occAttributes?.length) {
      httpParams = this.addAttributesParams(
        request.occAttributes,
        'occAttributes',
        httpParams
      );
    }

    return this._http
      .get<TermDistributionSet>(
        this._env.get('apiUrl') + 'terms/distributions',
        {
          params: httpParams,
        }
      )
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
