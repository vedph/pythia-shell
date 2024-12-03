import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  RefLookupFilter,
  RefLookupService,
} from '@myrmidon/cadmus-refs-lookup';
import { DataPage } from '@myrmidon/ngx-tools';

import { CorpusService } from '@myrmidon/pythia-api';
import { Corpus } from '@myrmidon/pythia-core';

@Injectable({
  providedIn: 'root',
})
export class CorpusRefLookupService implements RefLookupService {
  constructor(private _corpusService: CorpusService) {}

  lookup(filter: RefLookupFilter, options?: any): Observable<Corpus[]> {
    return this._corpusService
      .getCorpora(
        {
          title: filter.text,
        },
        1,
        filter.limit
      )
      .pipe(map((page: DataPage<Corpus>) => page.items));
  }

  getName(item: Corpus): string {
    return item?.title;
  }
}
