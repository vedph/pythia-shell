import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { PageEvent } from '@angular/material/paginator';

import { DataPage } from '@myrmidon/ng-tools';
import { DocumentReadRequest } from '@myrmidon/pythia-core';
import { KwicSearchResult } from '@myrmidon/pythia-api';

import { SearchRepository } from '../../search.repository';

@Component({
  selector: 'pythia-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @ViewChild('queryCtl') queryElementRef: ElementRef | undefined;

  @Input()
  public initialQueryTerm: string | undefined;

  @Input()
  public hideAuthor?: boolean;
  @Input()
  public hideTitle?: boolean;

  public query$: Observable<string | undefined>;
  public lastQueries$: Observable<string[]>;
  public loading$: Observable<boolean | undefined>;
  public page$: Observable<DataPage<KwicSearchResult> | undefined>;
  public error$: Observable<string | undefined>;
  public readRequest$: Observable<DocumentReadRequest | undefined>;

  public query: FormControl<string | null>;
  public history: FormControl<string | null>;
  public form: FormGroup;

  public leftContextLabels: string[];
  public rightContextLabels: string[];
  public queryTabIndex: number;

  constructor(private _repository: SearchRepository, formBuilder: FormBuilder) {
    this.query = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(1000),
    ]);
    this.history = formBuilder.control(null);
    this.form = formBuilder.group({
      query: this.query,
      history: this.history,
    });
    this.leftContextLabels = ['5', '4', '3', '2', '1'];
    this.rightContextLabels = ['1', '2', '3', '4', '5'];
    this.queryTabIndex = 0;

    this.page$ = _repository.page$;
    this.query$ = _repository.query$;
    this.lastQueries$ = _repository.lastQueries$;
    this.loading$ = _repository.loading$;
    this.error$ = _repository.error$;
    this.readRequest$ = _repository.readRequest$;
  }

  ngOnInit(): void {
    if (this.initialQueryTerm) {
      this.query.setValue('[value="' + this.initialQueryTerm + '"]');
      setTimeout(() => this.search(), 0);
    }
  }

  public pageChange(event: PageEvent): void {
    this._repository.loadPage(event.pageIndex + 1, event.pageSize, {
      query: this.query.value!,
    });
  }

  public pickHistory(): void {
    if (!this.history.value) {
      return;
    }
    this.query.setValue(this.history.value);
    setTimeout(this.queryElementRef?.nativeElement.focus(), 0);
  }

  public search(): void {
    if (this.form.invalid) {
      return;
    }
    const query = this.query.value?.trim();
    if (!query) {
      return;
    }
    this._repository.addToHistory(query);
    this._repository.setFilter({ query });
  }

  public searchByEnter(event: KeyboardEvent): void {
    event.stopPropagation();
    this.search();
  }

  public onQueryPeek(query: string): void {
    this.query.setValue(query);
    setTimeout(() => {
      this.queryTabIndex = 0;
      this.queryElementRef?.nativeElement.focus();
    }, 0);
  }

  public onQueryChange(query: string): void {
    this.query.setValue(query);
    this._repository.addToHistory(query);
    this._repository.setFilter({ query });
  }

  public onPageChange(event: PageEvent): void {
    this._repository.setPage(event.pageIndex + 1, event.pageSize);
  }

  public readDocument(id: number) {
    this._repository.setReadRequest({
      documentId: id,
    });
  }

  public readDocumentPiece(id: number, start: number, length: number) {
    this._repository.setReadRequest({
      documentId: id,
      start: start,
      end: start + length,
    });
  }
}
