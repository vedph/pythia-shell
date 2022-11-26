import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataPage, EnvService, ErrorService } from '@myrmidon/ng-tools';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface AttributeFilter {
  pageNumber: number;
  pageSize: number;
  type: AttributeFilterType;
  name?: string;
}

export enum AttributeFilterType {
  Document = 0,
  Structure,
  Occurrence,
}

@Injectable({
  providedIn: 'root',
})
export class AttributeService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Get the specified page of attribute names.
   * @param filter The attributes filter. Set page size to 0 to get a
   * single page with all the attribute names at once.
   * @returns Page of names.
   */
  public getAttributeNames(
    filter: AttributeFilter
  ): Observable<DataPage<string>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('pageNumber', filter.pageNumber.toString());
    httpParams = httpParams.set('pageSize', filter.pageSize.toString());
    httpParams = httpParams.set('type', filter.type.toString());

    if (filter.name) {
      httpParams = httpParams.set('name', filter.name);
    }

    return this._http
      .get<DataPage<string>>(this._env.get('apiUrl') + 'attributes', {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
