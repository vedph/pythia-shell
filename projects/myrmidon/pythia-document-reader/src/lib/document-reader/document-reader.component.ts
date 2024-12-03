import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import { PythiaApiModule, ReaderService } from '@myrmidon/pythia-api';
import {
  Document,
  DocumentReadRequest,
  PythiaCoreModule,
  TextMapNode,
} from '@myrmidon/pythia-core';

import { DocumentReaderRepository } from '../document-reader.repository';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MapPagedTreeBrowserComponent } from '../map-paged-tree-browser/map-paged-tree-browser.component';

@Component({
  selector: 'pythia-document-reader',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    // Pythia
    PythiaApiModule,
    PythiaCoreModule,
    MapPagedTreeBrowserComponent,
  ],
  templateUrl: './document-reader.component.html',
  styleUrls: ['./document-reader.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentReaderComponent {
  private _busy: boolean | undefined;
  private _request: DocumentReadRequest | undefined;

  @Input()
  public get request(): DocumentReadRequest | undefined {
    return this._request;
  }
  public set request(value: DocumentReadRequest | undefined) {
    if (
      this._request &&
      value &&
      this._request.documentId === value.documentId &&
      this._request.start === value.start &&
      this._request.end === value.end
    ) {
      return;
    }
    this._request = value;
    if (value) {
      this._repository.load(value, value.initialPath);
    } else {
      this._repository.reset();
    }
  }

  /**
   * Whether to show debug information.
   */
  @Input()
  public debug?: boolean;

  /**
   * Whether to hide the map.
   */
  @Input()
  public hideMap?: boolean;

  public loading$: Observable<boolean>;
  public document$: Observable<Document | undefined>;
  public map$: Observable<TextMapNode | undefined>;
  public text$: Observable<string | undefined>;

  constructor(
    private _repository: DocumentReaderRepository,
    private _readerService: ReaderService
  ) {
    this.loading$ = _repository.loading$;
    this.document$ = _repository.document$;
    this.map$ = _repository.map$;
    this.text$ = _repository.text$;
  }

  public onMapNodeClick(node: TextMapNode): void {
    if (this._busy) {
      return;
    }
    this._busy = true;
    const path = this._readerService.getNodePath(node);
    this._repository.loadTextFromPath(path).finally(() => {
      this._busy = false;
    });
  }
}
