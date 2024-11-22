import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';

import { Corpus } from '@myrmidon/pythia-core';

import {
  QueryBuilder,
  QueryBuilderTermDef,
  QueryBuilderTermType,
} from '../../query-builder';
import { QueryEntrySet } from '../query-entry-set/query-entry-set.component';

export const QUERY_BUILDER_ATTR_DEFS_KEY = 'pythiaQueryBuilderAttrDefs';

/**
 * Query builder component. This editor contains:
 * - two query entries sets, one for the text and another for the optional
 * document scope.
 * - a corpus scope.
 */
@Component({
    selector: 'pythia-query-builder',
    templateUrl: './query-builder.component.html',
    styleUrls: ['./query-builder.component.css'],
    standalone: false
})
export class QueryBuilderComponent {
  private readonly _queryBuilder: QueryBuilder;

  // query entries
  public set: QueryEntrySet;
  // query scope
  public corpora: Corpus[];
  public docSet: QueryEntrySet;

  public hasErrors: boolean;
  public readonly attrDefinitions: QueryBuilderTermDef[];
  public readonly docAttrDefinitions: QueryBuilderTermDef[];

  /**
   * True to enable the peek button.
   */
  @Input()
  public canPeek?: boolean;

  /**
   * True to hide the corpora section.
   */
  @Input()
  public hideCorpora?: boolean;

  /**
   * True to hide the documents section.
   */
  @Input()
  public hideDocuments?: boolean;

  /**
   * Emitted whenever user wants to peek the query's text.
   */
  @Output()
  public queryPeek: EventEmitter<string>;

  /**
   * Emitted whenever a query is built.
   */
  @Output()
  public queryChange: EventEmitter<string>;

  constructor(
    @Inject(QUERY_BUILDER_ATTR_DEFS_KEY)
    attrDefinitions: QueryBuilderTermDef[]
  ) {
    this._queryBuilder = new QueryBuilder();
    this.hasErrors = true;
    this.set = { entries: [] };
    this.corpora = [];
    this.docSet = { entries: [] };
    this.attrDefinitions = attrDefinitions.filter(
      (d) => d.type !== QueryBuilderTermType.Document
    );
    this.docAttrDefinitions = attrDefinitions.filter(
      (d) => d.type === QueryBuilderTermType.Document
    );
    // events
    this.queryPeek = new EventEmitter<string>();
    this.queryChange = new EventEmitter<string>();
  }

  public onCorporaChange(corpora: Corpus[]): void {
    this.corpora = corpora;
  }

  private updateHasErrors(): void {
    this.hasErrors =
      this.set.errors?.length || this.docSet.errors?.length ? true : false;
  }

  public onEntrySetChange(set: QueryEntrySet): void {
    this.set = set;
    this.updateHasErrors();
  }

  public onDocEntrySetChange(set: QueryEntrySet): void {
    this.docSet = set;
    this.updateHasErrors();
  }

  private buildQuery(): string | null {
    if (this.set.errors?.length || this.docSet.errors?.length) {
      return null;
    }
    let query = '';

    if (this.corpora?.length) {
      query += this._queryBuilder.buildCorpusSection(this.corpora);
    }

    if (this.docSet.entries?.length) {
      this._queryBuilder.forDocument(true);
      this._queryBuilder.setEntries(this.docSet.entries);
      query += this._queryBuilder.build();
    }

    this._queryBuilder.forDocument(false);
    this._queryBuilder.setEntries(this.set.entries);
    query += this._queryBuilder.build();

    return query;
  }

  public build(): void {
    const query = this.buildQuery();
    if (!query) {
      return;
    }
    this.queryChange.emit(query);
  }

  public peek(): void {
    const query = this.buildQuery();
    if (!query) {
      return;
    }
    this.queryPeek.emit(query);
  }
}
