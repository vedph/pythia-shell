import { Component, EventEmitter, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { IndexTerm } from '@myrmidon/pythia-core';
import { PaginationData } from '@ngneat/elf-pagination';

import { TermListRepository } from '../term-list.repository';
import { StatusState } from '@ngneat/elf-requests';

@Component({
  selector: 'pythia-term-list',
  templateUrl: './term-list.component.html',
  styleUrls: ['./term-list.component.css'],
})
export class TermListComponent {
  public pagination$: Observable<PaginationData & { data: IndexTerm[] }>;
  public status$: Observable<StatusState>;

  @Output()
  public searchRequest: EventEmitter<string>;

  constructor(private _repository: TermListRepository) {
    this.searchRequest = new EventEmitter<string>();
    this.pagination$ = _repository.pagination$;
    this.status$ = this._repository.status$;
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
}
