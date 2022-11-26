import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Corpus } from '@myrmidon/pythia-core';
import { DataPage, EnvService, ErrorService } from '@myrmidon/ng-tools';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { DocumentFilter } from './document.service';

export interface CorpusFilter {
  pageNumber: number;
  pageSize: number;
  id?: string;
  title?: string;
  counts?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CorpusService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Get the specified page of corpora.
   * @param filter The filter.
   * @returns Page.
   */
  public getCorpora(filter: CorpusFilter): Observable<DataPage<Corpus>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('pageNumber', filter.pageNumber.toString());
    httpParams = httpParams.set('pageSize', filter.pageSize.toString());

    if (filter.id) {
      httpParams = httpParams.set('id', filter.id);
    }
    if (filter.title) {
      httpParams = httpParams.set('title', filter.title);
    }
    if (filter.counts) {
      httpParams = httpParams.set('counts', filter.counts);
    }

    return this._http
      .get<DataPage<Corpus>>(this._env.get('apiUrl') + 'corpora', {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the corpus with the specified ID.
   * @param id The corpus ID.
   * @param noDocumentIds True to avoid getting the list of document IDs
   * included in the requested corpus.
   * @returns The corpus.
   */
  public getCorpus(id: string, noDocumentIds: boolean): Observable<Corpus> {
    let httpParams = new HttpParams();
    if (noDocumentIds) {
      httpParams = httpParams.set('noDocumentIds', noDocumentIds);
    }

    return this._http
      .get<Corpus>(this._env.get('apiUrl') + 'corpora/' + id, {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Add or update the specified corpus.
   * @param corpus The corpus.
   * @param sourceId The optional corpus source ID to copy documents from.
   * @returns Observable with added corpus.
   */
  public addCorpus(corpus: Corpus, sourceId?: string): Observable<Corpus> {
    const post = {
      ...corpus,
      sourceId: sourceId,
    };
    return this._http
      .post<Corpus>(this._env.get('apiUrl') + 'corpora', post)
      .pipe(catchError(this._error.handleError));
  }

  /**
   * Adds to the specified corpus all the documents matching the specified
   * filter.
   * @param id The corpus ID.
   * @param filter The documents filter.
   */
  public addDocumentsByFilter(
    id: string,
    filter: DocumentFilter
  ): Observable<any> {
    return this._http
      .put(this._env.get('apiUrl') + 'corpora/' + id + '/add', filter)
      .pipe(catchError(this._error.handleError));
  }

  /**
   * Removes from the specified corpus all the documents matching the specified
   * filter.
   * @param id The corpus ID.
   * @param filter The documents filter.
   */
  public removeDocumentsByFilter(
    id: string,
    filter: DocumentFilter
  ): Observable<any> {
    return this._http
      .put(this._env.get('apiUrl') + 'corpora/' + id + '/del', filter)
      .pipe(catchError(this._error.handleError));
  }

  /**
   * Delete the specified corpus.
   * @param id The corpus ID.
   */
  public deleteCorpus(id: string): Observable<any> {
    return this._http
      .delete(this._env.get('apiUrl') + 'corpora/' + id)
      .pipe(catchError(this._error.handleError));
  }
}
