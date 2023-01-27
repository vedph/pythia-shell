import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { PageEvent } from '@angular/material/paginator';

import { PaginationData } from '@ngneat/elf-pagination';

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

  public pagination$: Observable<PaginationData & { data: KwicSearchResult[] }>;
  public query$: Observable<string | undefined>;
  public lastQueries$: Observable<string[]>;
  public loading$: Observable<boolean | undefined>;
  public readRequest$: Observable<DocumentReadRequest | undefined>;
  public query: FormControl<string | null>;
  public history: FormControl<string | null>;
  public form: FormGroup;
  public leftContextLabels: string[];
  public rightContextLabels: string[];

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

    this.pagination$ = _repository.pagination$;
    this.query$ = _repository.query$;
    this.lastQueries$ = _repository.lastQueries$;
    this.loading$ = _repository.loading$;
    this.readRequest$ = _repository.readRequest$;
  }

  ngOnInit(): void {
    if (this.initialQueryTerm) {
      this.query.setValue('[value="' + this.initialQueryTerm + '"]');
      setTimeout(() => this.search(), 0);
    }
  }

  public pageChange(event: PageEvent): void {
    this._repository.search(null, 5, event.pageIndex + 1, event.pageSize);
  }

  public pickHistory(): void {
    if (!this.history.value) {
      return;
    }
    this.query.setValue(this.history.value);
    setTimeout(this.queryElementRef?.nativeElement.focus(), 0);
  }

  public search(): void {
    if (this.form.invalid || this._repository.isLoading()) {
      return;
    }
    const query = this.query.value?.trim();
    if (!query) {
      return;
    }
    this._repository.addToHistory(query);
    this._repository.search(query);
  }

  public searchByEnter(event: KeyboardEvent): void {
    if (this._repository.isLoading()) {
      return;
    }
    event.stopPropagation();
    this.search();
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
