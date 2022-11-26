import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  RefLookupFilter,
  RefLookupService,
} from '@myrmidon/cadmus-refs-lookup';
import { DataPage } from '@myrmidon/ng-tools';

import { ProfileService } from '@myrmidon/pythia-api';
import { Profile } from '@myrmidon/pythia-core';

@Injectable({
  providedIn: 'root',
})
export class ProfileRefLookupService implements RefLookupService {
  constructor(private _profileService: ProfileService) {}

  lookup(filter: RefLookupFilter, options?: any): Observable<Profile[]> {
    return this._profileService
      .getProfiles({
        pageNumber: 1,
        pageSize: filter.limit,
        id: filter.text,
      })
      .pipe(map((page: DataPage<Profile>) => page.items));
  }

  getName(item: Profile): string {
    return item?.id;
  }
}
