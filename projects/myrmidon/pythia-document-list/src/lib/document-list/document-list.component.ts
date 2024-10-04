import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import '@angular/localize/init';
import { Observable, take } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { DataPage } from '@myrmidon/ng-tools';
import { Document, DocumentReadRequest } from '@myrmidon/pythia-core';
import { CorpusService, DocumentFilter } from '@myrmidon/pythia-api';

import { DocumentRepository } from '../document.repository';
import { CorpusActionRequest } from '../document-corpus/document-corpus.component';
import { DocumentFilters } from '../document-filter/document-filter.component';

@Component({
  selector: 'pythia-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  providers: [DocumentRepository],
})
export class DocumentListComponent {
  public loading$: Observable<boolean>;
  public activeDocument$: Observable<Document | undefined>;
  public filter$: Observable<Readonly<DocumentFilter>>;
  public page$: Observable<Readonly<DataPage<Document>>>;

  /**
   * The list of document filters to be hidden.
   */
  @Input()
  public hiddenFilters?: DocumentFilters;

  @Output()
  public readRequest: EventEmitter<DocumentReadRequest>;

  constructor(
    private _repository: DocumentRepository,
    private _snackbar: MatSnackBar,
    private _corpusService: CorpusService
  ) {
    this.loading$ = _repository.loading$;
    this.activeDocument$ = _repository.activeDocument$;
    this.filter$ = _repository.filter$;
    this.page$ = _repository.page$;
    this.readRequest = new EventEmitter<DocumentReadRequest>();
  }

  public onFilterChange(filter: DocumentFilter): void {
    this._repository.setFilter(filter);
  }

  public onPageChange(event: PageEvent): void {
    this._repository.setPage(event.pageIndex + 1, event.pageSize);
  }

  public selectDocument(document: Document): void {
    this._repository.setActiveDocument(document.id);
  }

  public onDocumentClose(): void {
    this._repository.setActiveDocument(null);
  }

  public requestRead(document: Document): void {
    this.readRequest.emit({ documentId: document.id });
  }

  private isEmptyFilter(filter: DocumentFilter): boolean {
    return (
      !filter.corpusId &&
      !filter.author &&
      !filter.title &&
      !filter.source &&
      !filter.profileId &&
      !filter.minDateValue &&
      !filter.maxDateValue &&
      !filter.minTimeModified &&
      !filter.maxTimeModified &&
      !filter.attributes?.length
    );
  }

  public onCorpusAction(request: CorpusActionRequest): void {
    const filter = this._repository.getFilter();
    if (this.isEmptyFilter(filter)) {
      this._snackbar.open($localize`No filter applied`, 'OK', {
        duration: 3000,
      });
      return;
    }
    switch (request.action) {
      case 'add-filtered':
        this._corpusService
          .addDocumentsByFilter(request.corpusId, filter)
          .pipe(take(1))
          .subscribe({
            next: (_) => {
              this._snackbar.open($localize`Corpus updated`, 'OK', {
                duration: 2000,
              });
            },
            error: (error) => {
              console.error($localize`Error adding documents by filter`);
              if (error) {
                console.error(JSON.stringify(error));
              }
              this._snackbar.open($localize`Error updating corpus`, 'OK');
            },
          });
        break;
      case 'del-filtered':
        this._corpusService
          .removeDocumentsByFilter(request.corpusId, filter)
          .pipe(take(1))
          .subscribe({
            next: (_) => {
              this._snackbar.open($localize`Corpus updated`, 'OK', {
                duration: 2000,
              });
            },
            error: (error) => {
              console.error($localize`Error removing documents by filter`);
              if (error) {
                console.error(JSON.stringify(error));
              }
              this._snackbar.open($localize`Error updating corpus`, 'OK');
            },
          });
        break;
    }
  }

  public refresh(): void {
    this._repository.reset();
  }
}
