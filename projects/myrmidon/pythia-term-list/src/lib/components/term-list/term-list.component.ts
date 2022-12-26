import { Component, EventEmitter, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { IndexTerm } from '@myrmidon/pythia-core';
import { PaginationData } from '@ngneat/elf-pagination';
import { StatusState } from '@ngneat/elf-requests';

import { TermListRepository } from '../../term-list.repository';

@Component({
  selector: 'pythia-term-list',
  templateUrl: './term-list.component.html',
  styleUrls: ['./term-list.component.css'],
})
export class TermListComponent {
  public pagination$: Observable<PaginationData & { data: IndexTerm[] }>;
  public loading$: Observable<boolean>;
  public activeTerm?: IndexTerm;

  @Output()
  public searchRequest: EventEmitter<string>;

  constructor(private _repository: TermListRepository) {
    this.searchRequest = new EventEmitter<string>();
    this.pagination$ = _repository.pagination$;
    this.loading$ = this._repository.loading$;
  }

  public pageChange(event: PageEvent): void {
    this._repository.loadPage(event.pageIndex + 1, event.pageSize);
  }

  public refresh(): void {
    this._repository.clearCache();
    this._repository.loadPage(1);
  }

  public requestSearch(term: string): void {
    this.searchRequest.emit(term);
  }

  public clearCache(): void {
    this._repository.clearCache();
    this._repository.loadPage(1);
  }

  public setActiveTerm(term: IndexTerm): void {
    this.activeTerm = term;
  }
}
