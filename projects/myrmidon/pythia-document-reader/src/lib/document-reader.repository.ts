import {
  Document,
  DocumentReadRequest,
  TextMapNode,
} from '@myrmidon/pythia-core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

import { DocumentService, ReaderService } from '@myrmidon/pythia-api';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DocumentReaderRepository {
  private _document$: BehaviorSubject<Document | undefined>;
  private _map$: BehaviorSubject<TextMapNode | undefined>;
  private _text$: BehaviorSubject<string | undefined>;
  private _loading$: BehaviorSubject<boolean>;

  public get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }
  public get document$(): Observable<Document | undefined> {
    return this._document$;
  }
  public get map$(): Observable<TextMapNode | undefined> {
    return this._map$;
  }
  public get text$(): Observable<string | undefined> {
    return this._text$;
  }

  constructor(
    private _docService: DocumentService,
    private _readService: ReaderService
  ) {
    this._document$ = new BehaviorSubject<Document | undefined>(undefined);
    this._map$ = new BehaviorSubject<TextMapNode | undefined>(undefined);
    this._text$ = new BehaviorSubject<string | undefined>(undefined);
    this._loading$ = new BehaviorSubject<boolean>(false);
  }

  public getDocumentId(): number | undefined {
    return this._document$.value?.id;
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
    this._document$.next(undefined);
    this._map$.next(undefined);
    this._text$.next(undefined);
  }

  /**
   * Load the requested document with its map and optionally text.
   *
   * @param request The request.
   * @param initialPath The optional initial path to open once text has been loaded
   * (not used for range requests).
   */
  public load(request: DocumentReadRequest, initialPath?: string): void {
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
      }).subscribe((result) => {
        this._loading$.next(false);
        this.setNodeParents(result.map);
        this._document$.next(result.doc);
        this._map$.next(result.map);
        this._text$.next(result.piece.text);
      });
    } else {
      forkJoin({
        doc: this._docService.getDocument(request.documentId),
        map: this._readService.getDocumentMap(request.documentId),
      }).subscribe((result) => {
        this._loading$.next(false);
        this.setNodeParents(result.map);
        this._document$.next(result.doc);
        this._map$.next(result.map);
        this._text$.next(undefined);
        // initial path if requested
        if (initialPath) {
          this.loadTextFromPath(initialPath);
        }
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
      this._readService.getDocumentPieceFromPath(id, path).subscribe({
        next: (piece) => {
          this._loading$.next(false);
          this._text$.next(this.extractBodyContent(piece.text));
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
      if (!this._document$.value?.id) {
        reject('No document loaded');
        return;
      }

      this._loading$.next(true);
      this._readService
        .getDocumentPieceFromRange(this._document$.value.id, start, end)
        .subscribe({
          next: (piece) => {
            this._loading$.next(false);
            this._text$.next(this.extractBodyContent(piece.text));
            resolve(true);
          },
          error: (error) => {
            this._loading$.next(false);
            console.error(
              `Unable to load text ${this._document$.value?.id} at ${start}-${end}: ` +
                (error ? console.error(JSON.stringify(error)) : '')
            );
            reject(`Error loading text from ${start}-${end}`);
          },
        });
    });
  }
}
