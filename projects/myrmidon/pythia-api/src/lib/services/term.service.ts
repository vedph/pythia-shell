import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataPage, EnvService, ErrorService } from '@myrmidon/ng-tools';
import { IndexTerm } from '@myrmidon/pythia-core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface TermFilter {
  pageNumber: number;
  pageSize: number;
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
  tokAttributes?: string; // name=value CSV
  valuePattern?: string; // wildcards: ? and *
  minCount?: number;
  maxCount?: number;
  sortOrder?: TermSortOrder;
  descending?: boolean;
}

export enum TermSortOrder {
  Default = 0,
  ByValue,
  ByReversedValue,
  ByCount,
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

  public getTerms(filter: TermFilter): Observable<DataPage<IndexTerm>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('pageNumber', filter.pageNumber.toString());
    httpParams = httpParams.set('pageSize', filter.pageSize.toString());

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
        filter.minTimeModified.toString()
      );
    }
    if (filter.maxTimeModified) {
      httpParams = httpParams.set(
        'maxTimeModified',
        filter.maxTimeModified.toString()
      );
    }
    if (filter.docAttributes) {
      httpParams = httpParams.set('docAttributes', filter.docAttributes);
    }
    if (filter.tokAttributes) {
      httpParams = httpParams.set('tokAttributes', filter.tokAttributes);
    }
    if (filter.valuePattern) {
      httpParams = httpParams.set('valuePattern', filter.valuePattern);
    }
    if (filter.minCount) {
      httpParams = httpParams.set('minCount', filter.minCount.toString());
    }
    if (filter.maxCount) {
      httpParams = httpParams.set('maxCount', filter.maxCount.toString());
    }
    if (filter.sortOrder) {
      httpParams = httpParams.set('sort', filter.sortOrder.toString());
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
}
