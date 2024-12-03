import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DataPage, EnvService, ErrorService } from '@myrmidon/ngx-tools';
import { Document } from '@myrmidon/pythia-core';

export enum DocumentSortOrder {
  Default = 0,
  Author,
  Title,
  Date,
}

export interface DocumentFilter {
  corpusId?: string;
  author?: string;
  title?: string;
  source?: string;
  profileId?: string;
  minDateValue?: number;
  maxDateValue?: number;
  minTimeModified?: Date;
  maxTimeModified?: Date;
  attributes?: string; // name=value (CSV)
  sortOrder?: DocumentSortOrder;
  descending?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Get the specified page of documents.
   * @param filter The filter.
   * @returns Observable with a page of documents.
   */
  public getDocuments(
    filter: DocumentFilter,
    pageNumber = 1,
    pageSize = 20
  ): Observable<DataPage<Document>> {
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
        filter.minTimeModified.toString()
      );
    }
    if (filter.maxTimeModified) {
      httpParams = httpParams.set(
        'maxTimeModified',
        filter.maxTimeModified.toString()
      );
    }
    if (filter.attributes?.length) {
      httpParams = httpParams.set('attributes', filter.attributes);
    }
    if (filter.sortOrder) {
      httpParams = httpParams.set('sort', filter.sortOrder.toString());
    }
    if (filter.descending) {
      httpParams = httpParams.set('descending', filter.descending);
    }

    return this._http
      .get<DataPage<Document>>(this._env.get('apiUrl') + 'documents', {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the document with the specified ID.
   * @param id The document's ID.
   * @param content True to retrieve the document's content.
   * @returns Oservable with document.
   */
  public getDocument(id: number, content = false): Observable<Document> {
    let httpParams = new HttpParams();
    if (content) {
      httpParams = httpParams.set('content', 'true');
    }
    return this._http
      .get<Document>(this._env.get('apiUrl') + 'documents/' + id, {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
