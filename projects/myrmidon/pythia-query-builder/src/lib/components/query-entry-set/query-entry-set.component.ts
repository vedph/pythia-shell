import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';

import {
  QueryBuilder,
  QueryBuilderEntry,
  QueryBuilderTermDef,
  QueryEntryType,
} from '../../query-builder';

/**
 * Entries set editor component.
 */
@Component({
  selector: 'pythia-query-entry-set',
  templateUrl: './query-entry-set.component.html',
  styleUrls: ['./query-entry-set.component.css'],
})
export class QueryEntrySetComponent implements OnInit, OnDestroy {
  private readonly _builder: QueryBuilder;
  private _sub?: Subscription;

  public TYPES = ['clause', 'AND', 'OR', 'AND NOT', '(', ')'];
  public editedIndex: number;
  public editedEntry?: QueryBuilderEntry;
  public entries$: Observable<QueryBuilderEntry[]>;
  public errors$: Observable<string[]>;

  /**
   * True if the set refers to a document query. This is meant to be set
   * only once.
   */
  @Input()
  public isDocument?: boolean;

  /**
   * The attributes definitions to use. This is meant to be set only once.
   */
  @Input()
  public attrDefinitions: QueryBuilderTermDef[];

  /**
   * The operator definitions to use. This is meant to be set only once
   * and just defaults to QUERY_OP_DEFS.
   */
  @Input()
  public opDefinitions: QueryBuilderTermDef[];

  @Input()
  public get entries(): QueryBuilderEntry[] {
    return this._builder.getEntries() || [];
  }
  public set entries(value: QueryBuilderEntry[]) {
    this._builder.setEntries(value);
  }

  @Output()
  public entriesChange: EventEmitter<QueryBuilderEntry[]>;

  constructor() {
    this._builder = new QueryBuilder();
    this.editedIndex = -1;
    this.attrDefinitions = [];
    this.opDefinitions = [];
    this.entries$ = this._builder.selectEntries();
    this.errors$ = this._builder.selectErrors();
    this.entriesChange = new EventEmitter<QueryBuilderEntry[]>();
  }

  public ngOnInit(): void {
    this._builder.forDocument(this.isDocument);
    this._sub = this.entries$
      .pipe(distinctUntilChanged())
      .subscribe((entries) => {
        this.entriesChange.emit(entries);
      });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public addEntry(): void {
    this.editEntry(
      {
        type: QueryEntryType.Clause,
      },
      -1
    );
  }

  public editEntry(entry: QueryBuilderEntry, index: number): void {
    this.editedEntry = entry;
    this.editedIndex = index;
  }

  public saveEntry(entry: QueryBuilderEntry): void {
    this._builder.addEntry(entry, this.editedIndex);
  }

  public closeEntry(): void {
    this.editedEntry = undefined;
    this.editedIndex = -1;
  }

  public deleteEntry(index: number): void {
    this._builder.deleteEntry(index);
  }

  public moveEntryUp(index: number): void {
    this._builder.moveEntryUp(index);
  }

  public moveEntryDown(index: number): void {
    this._builder.moveEntryDown(index);
  }
}