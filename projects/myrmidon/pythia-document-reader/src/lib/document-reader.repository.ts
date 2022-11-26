import {
  Document,
  DocumentReadRequest,
  TextMapNode,
} from '@myrmidon/pythia-core';
import { BehaviorSubject, forkJoin, Observable, take } from 'rxjs';

import { createStore, select, setProp, withProps } from '@ngneat/elf';

import { DocumentService, ReaderService } from '@myrmidon/pythia-api';
import { Injectable } from '@angular/core';

export interface DocumentReaderProps {
  document?: Document;
  map?: TextMapNode;
  text?: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentReaderRepository {
  private _store;
  private _loading$: BehaviorSubject<boolean>;

  public loading$: Observable<boolean>;
  public document$: Observable<Document | undefined>;
  public map$: Observable<TextMapNode | undefined>;
  public text$: Observable<string | undefined>;

  constructor(
    private _docService: DocumentService,
    private _readService: ReaderService
  ) {
    this._store = createStore(
      { name: 'document-reader' },
      withProps<DocumentReaderProps>({})
    );
    this.document$ = this._store.pipe(select((state) => state.document));
    this.map$ = this._store.pipe(select((state) => state.map));
    this.text$ = this._store.pipe(select((state) => state.text));

    this._loading$ = new BehaviorSubject<boolean>(false);
    this.loading$ = this._loading$.asObservable();
  }

  public getDocumentId(): number | undefined {
    return this._store.query((state) => state.document?.id);
  }

  private setNodeParents(node: TextMapNode, parent?: TextMapNode) {
    node.parent = parent;
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        this.setNodeParents(node.children[i], node);
      }
    }
  }

  public reset(): void {
    this._store.update((state) => ({
      ...state,
      document: undefined,
      map: undefined,
      text: undefined,
    }));
  }

  /**
   * Load the requested document with its map and eventually text.
   *
   * @param request The request.
   */
  public load(request: DocumentReadRequest): void {
    this._loading$.next(true);

    if (request.start && request.end) {
      forkJoin({
        doc: this._docService.getDocument(request.documentId),
        map: this._readService.getDocumentMap(request.documentId),
        piece: this._readService.getDocumentPieceFromRange(
          request.documentId,
          request.start,
          request.end
        ),
      })
        .pipe(take(1))
        .subscribe((result) => {
          this._loading$.next(false);
          this.setNodeParents(result.map);
          this._store.update((state) => ({
            ...state,
            document: result.doc,
            map: result.map,
            text: result.piece.text,
          }));
        });
    } else {
      forkJoin({
        doc: this._docService.getDocument(request.documentId),
        map: this._readService.getDocumentMap(request.documentId),
      })
        .pipe(take(1))
        .subscribe((result) => {
          this._loading$.next(false);
          this._store.update((state) => ({
            ...state,
            document: result.doc,
            map: result.map,
            text: undefined,
          }));
        });
    }
  }

  /**
   * Extract the body element content from the specified HTML code.
   * If no body element is found, just return the input code unchanged.
   *
   * @param html The HTML code.
   * @returns The body's content extracted from the HTML code, or
   * the code itself when it does not contain a body at all.
   */
  private extractBodyContent(html: string | null): string {
    if (!html) {
      return '';
    }
    if (html.indexOf('<body') === -1) {
      return html;
    }

    // remove everything up to opening body
    html = html.replace(/^.+<body\b[^>]*>/gs, '');

    // remove everything from closing body
    html = html.replace(/<\/body>$/gs, '');

    return html;
  }

  /**
   * Load the text corresponding to the specified path in the document's map.
   *
   * @param path The document's map path.
   * @returns A promise returning true when loading is complete.
   */
  public loadTextFromPath(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const id = this.getDocumentId();
      if (!id) {
        reject('No document loaded');
        return;
      }

      this._loading$.next(true);
      this._readService
        .getDocumentPieceFromPath(id, path)
        .pipe(take(1))
        .subscribe({
          next: (piece) => {
            this._loading$.next(false);
            this._store.update(
              setProp('text', this.extractBodyContent(piece.text))
            );
            resolve(true);
          },
          error: (error) => {
            this._loading$.next(false);
            console.error(
              'Error loading text: ' +
                (error ? console.error(JSON.stringify(error)) : '')
            );
            reject('Error loading text from path ' + JSON.stringify(path));
          },
        });
    });
  }

  /**
   * Load the specified text range.
   * @param start The start index.
   * @param end The end index (exclusive).
   * @returns A promise returning true when loading is complete.
   */
  public loadTextFromRange(start: number, end: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const state = this._store.getValue();
      if (!state.document?.id) {
        reject('No document loaded');
        return;
      }

      this._loading$.next(true);
      this._readService
        .getDocumentPieceFromRange(state.document.id, start, end)
        .pipe(take(1))
        .subscribe({
          next: (piece) => {
            this._loading$.next(false);
            this._store.update(
              setProp('text', this.extractBodyContent(piece.text))
            );
            resolve(true);
          },
          error: (error) => {
            this._loading$.next(false);
            console.error(
              `Unable to load text ${state.document?.id} at ${start}-${end}: ` +
                (error ? console.error(JSON.stringify(error)) : '')
            );
            reject(`Error loading text from ${start}-${end}`);
          },
        });
    });
  }
}
