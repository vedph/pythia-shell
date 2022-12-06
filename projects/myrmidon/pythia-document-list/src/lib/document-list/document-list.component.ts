import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable, take } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { PaginationData } from '@ngneat/elf-pagination';
import { StatusState } from '@ngneat/elf-requests';

import { Document, DocumentReadRequest } from '@myrmidon/pythia-core';
import { CorpusService } from '@myrmidon/pythia-api';

import { DocumentRepository } from '../document.repository';
import { CorpusActionRequest } from '../document-corpus/document-corpus.component';

@Component({
  selector: 'pythia-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
  providers: [DocumentRepository],
})
export class DocumentListComponent implements OnInit {
  public pagination$: Observable<PaginationData & { data: Document[] }>;
  public status$: Observable<StatusState>;
  public activeDocument$: Observable<Document | undefined>;

  @Output()
  public readRequest: EventEmitter<DocumentReadRequest>;

  constructor(
    private _repository: DocumentRepository,
    private _snackbar: MatSnackBar,
    private _corpusService: CorpusService
  ) {
    this.pagination$ = _repository.pagination$;
    this.status$ = _repository.status$;
    this.activeDocument$ = _repository.activeDocument$;
    this.readRequest = new EventEmitter<DocumentReadRequest>();
  }

  ngOnInit(): void {
    this._repository.loadLookup();
  }

  public pageChange(event: PageEvent): void {
    this._repository.loadPage(event.pageIndex + 1, event.pageSize);
  }

  public selectDocument(document: Document): void {
    this._repository.setActiveDocumentId(document.id);
  }

  public onDocumentClose(): void {
    this._repository.resetActiveDocumentId();
  }

  public requestRead(document: Document): void {
    this.readRequest.emit({ documentId: document.id });
  }

  public onCorpusAction(request: CorpusActionRequest): void {
    const filter = this._repository.getFilter();
    switch (request.action) {
      case 'add-filtered':
        this._corpusService
          .addDocumentsByFilter(request.corpusId, filter)
          .pipe(take(1))
          .subscribe({
            next: (_) => {
              this._snackbar.open('Corpus updated', 'OK', {
                duration: 2000,
              });
            },
            error: (error) => {
              console.error('Error adding documents by filter');
              if (error) {
                console.error(JSON.stringify(error));
              }
              this._snackbar.open('Error updating corpus', 'OK');
            },
          });
        break;
      case 'del-filtered':
        this._corpusService
          .removeDocumentsByFilter(request.corpusId, filter)
          .pipe(take(1))
          .subscribe({
            next: (_) => {
              this._snackbar.open('Corpus updated', 'OK', {
                duration: 2000,
              });
            },
            error: (error) => {
              console.error('Error removing documents by filter');
              if (error) {
                console.error(JSON.stringify(error));
              }
              this._snackbar.open('Error updating corpus', 'OK');
            },
          });
        break;
    }
  }

  public clearCache(): void {
    this._repository.clearCache();
    this._repository.loadPage(1);
  }
}
