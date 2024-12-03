import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataPage } from '@myrmidon/ngx-tools';
import {
  PagedListStore,
  PagedListStoreService,
} from '@myrmidon/paged-data-browsers';

import { CorpusFilter, CorpusService } from '@myrmidon/pythia-api';
import { Corpus } from '@myrmidon/pythia-core';

class CorpusServiceAdapter
  implements PagedListStoreService<CorpusFilter, Corpus>
{
  constructor(private _service: CorpusService) {}

  public loadPage(
    pageNumber: number,
    pageSize: number,
    filter: CorpusFilter
  ): Observable<DataPage<Corpus>> {
    return this._service.getCorpora(filter, pageNumber, pageSize);
  }
}

/**
 * Wrapper for a PagedListStore<F, E> instance.
 * This singleton service ensures that the corresponding component
 * preserves its state when navigating away and back.
 */
@Injectable({
  providedIn: 'root',
})
export class CorpusListBrowserService {
  public readonly store: PagedListStore<CorpusFilter, Corpus>;

  constructor(service: CorpusService) {
    this.store = new PagedListStore<CorpusFilter, Corpus>(
      new CorpusServiceAdapter(service)
    );
  }
}
