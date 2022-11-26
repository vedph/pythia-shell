import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TextMapNode } from '@myrmidon/pythia-core';
import { EnvService, ErrorService } from '@myrmidon/ng-tools';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReaderService {
  constructor(
    private _http: HttpClient,
    private _error: ErrorService,
    private _env: EnvService
  ) {}

  /**
   * Get the contents map of the specified document.
   * @param id The document's ID.
   * @returns Map's root node.
   */
  public getDocumentMap(id: number): Observable<TextMapNode> {
    return this._http
      .get<TextMapNode>(this._env.get('apiUrl') + 'documents/' + id + '/map')
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the text of the specified document.
   * @param id The document's ID.
   * @returns Text.
   */
  public getDocumentText(id: number): Observable<string> {
    return this._http
      .get<string>(this._env.get('apiUrl') + 'documents/' + id + '/text')
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the specified document piece from its path.
   * @param id The document's ID.
   * @param path The path.
   * @returns Piece.
   */
  public getDocumentPieceFromPath(
    id: number,
    path: string
  ): Observable<{ text: string }> {
    return this._http
      .get<{ text: string }>(
        this._env.get('apiUrl') + 'documents/' + id + '/path/' + path
      )
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the specified document piece from a range of locations.
   * @param id The document's ID.
   * @param start The range start.
   * @param end The range end (exclusive).
   * @returns Piece.
   */
  public getDocumentPieceFromRange(
    id: number,
    start: number,
    end: number
  ): Observable<{ text: string }> {
    return this._http
      .get<{ text: string }>(
        this._env.get('apiUrl') +
          'documents/' +
          id +
          '/range/' +
          start +
          '/' +
          end
      )
      .pipe(retry(3), catchError(this._error.handleError));
  }

  /**
   * Get the path to the specified text map node.
   * @param node The node.
   * @returns The path.
   */
  public getNodePath(node: TextMapNode): string {
    const sb: string[] = [];
    sb.push('0'); // 0=root node

    while (node && node.parent) {
      const i = node.parent?.children?.indexOf(node) || -1;
      sb.push(i.toString());
      node = node.parent;
    }

    return sb.join('.');
  }
}
