import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { DataPage, EnvService, ErrorService } from '@myrmidon/ng-tools';
import { Profile } from '@myrmidon/pythia-core';

export interface ProfileFilter {
  pageNumber: number;
  pageSize: number;
  id?: string;
  prefix?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Gets the specified page of profiles.
   * @param filter The profiles filter. Set page size to 0 to get all
   * the profiles in a single page at once.
   * @returns Page.
   */
  public getProfiles(filter: ProfileFilter): Observable<DataPage<Profile>> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('pageNumber', filter.pageNumber.toString());
    httpParams = httpParams.set('pageSize', filter.pageSize.toString());

    if (filter.id) {
      httpParams = httpParams.set('id', filter.id);
    }
    if (filter.prefix) {
      httpParams = httpParams.set('prefix', filter.prefix);
    }

    return this._http
      .get<DataPage<Profile>>(this._env.get('apiUrl') + 'profiles', {
        params: httpParams,
      })
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the profile with the specified ID.
   * @param id The profile's ID.
   * @returns The profile.
   */
  public getProfile(id: string): Observable<Profile> {
    return this._http
      .get<Profile>(this._env.get('apiUrl') + 'profiles/' + id)
      .pipe(retry(3), catchError(this._error.handleError));
  }
}
