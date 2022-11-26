import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ErrorService, EnvService } from '@myrmidon/ng-tools';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Get statistics about the index.
   * @returns Dictionary object with name=number pairs.
   */
  public getStatistics(): Observable<{ [key: string]: number }> {
    return this._http
      .get<{ [key: string]: number }>(this._env.get('apiUrl') + 'stats')
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
