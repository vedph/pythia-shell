import { Component, EventEmitter, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { DataPage } from '@myrmidon/ng-tools';
import { IndexTerm } from '@myrmidon/pythia-core';
import { TermFilter } from '@myrmidon/pythia-api';

import {
  TermListDistributionSet,
  TermListRepository,
} from '../../term-list.repository';

/**
 * A list of index terms.
 */
@Component({
  selector: 'pythia-term-list',
  templateUrl: './term-list.component.html',
  styleUrls: ['./term-list.component.css'],
})
export class TermListComponent {
  public page$: Observable<DataPage<IndexTerm>>;
  public loading$: Observable<boolean>;
  public set$: Observable<TermListDistributionSet | undefined>;
  public filter$: Observable<TermFilter>;
  public docAttributes$: Observable<string[]>;
  public occAttributes$: Observable<string[]>;

  /**
   * The active term. When the user picks a term from the list,
   * it becomes active and its frequencies distribution is displayed.
   */
  public activeTerm?: IndexTerm;

  /**
   * Emitted when the user requests a search for a term.
   */
  @Output()
  public searchRequest: EventEmitter<string>;

  constructor(private _repository: TermListRepository) {
    this.searchRequest = new EventEmitter<string>();
    this.page$ = _repository.page$;
    this.loading$ = this._repository.loading$;
    this.set$ = _repository.termSet$;
    this.filter$ = _repository.filter$;
    this.docAttributes$ = _repository.docAttributes$;
    this.occAttributes$ = _repository.occAttributes$;
  }

  public onFilterChange(filter: TermFilter): void {
    this._repository.setFilter(filter);
  }

  public onPageChange(event: PageEvent): void {
    this._repository.setPage(event.pageIndex + 1, event.pageSize);
  }

  public reset(): void {
    this.activeTerm = undefined;
    this._repository.reset();
  }

  public requestSearch(term: string): void {
    this.searchRequest.emit(term);
  }

  public setActiveTerm(term: IndexTerm): void {
    this.activeTerm = term;
  }
}
