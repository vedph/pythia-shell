import { Component, EventEmitter, Inject, Output } from '@angular/core';

import { Corpus } from '@myrmidon/pythia-core';
import { QueryBuilder } from '@myrmidon/pythia-query-builder';

import { QueryBuilderTermDef } from '../../query-builder';
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
})
export class QueryBuilderComponent {
  private readonly _queryBuilder: QueryBuilder;

  // query entries
  public set: QueryEntrySet;
  // query scope
  public corpora: Corpus[];
  public docSet: QueryEntrySet;

  public hasErrors: boolean;

  /**
   * Emitted whenever a query is built.
   */
  @Output()
  public queryChange: EventEmitter<string>;

  constructor(
    @Inject(QUERY_BUILDER_ATTR_DEFS_KEY)
    public attrDefinitions: QueryBuilderTermDef[]
  ) {
    this._queryBuilder = new QueryBuilder();
    this.hasErrors = true;
    this.set = { entries: [] };
    this.corpora = [];
    this.docSet = { entries: [] };
    // events
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

  public build(): void {
    if (this.set.errors?.length || this.docSet.errors?.length) {
      return;
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

    this.queryChange.emit(query);
  }
}
