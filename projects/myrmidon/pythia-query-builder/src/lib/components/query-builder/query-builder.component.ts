import { Component, EventEmitter, Inject, Output } from '@angular/core';

import { Corpus } from '@myrmidon/pythia-core';

import { QueryBuilderEntry, QueryBuilderTermDef } from '../../query-builder';
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
  // query entries
  public set: QueryEntrySet;
  // query scope
  public corpora: Corpus[];
  public docSet: QueryEntrySet;

  /**
   * Emitted whenever a query is built.
   */
  @Output()
  public queryChange: EventEmitter<string>;

  constructor(
    @Inject(QUERY_BUILDER_ATTR_DEFS_KEY)
    public attrDefinitions: QueryBuilderTermDef[]
  ) {
    this.set = { entries: [] };
    this.corpora = [];
    this.docSet = { entries: [] };
    // events
    this.queryChange = new EventEmitter<string>();
  }

  public onCorporaChange(corpora: Corpus[]): void {
    this.corpora = corpora;
  }

  public onEntrySetChange(set: QueryEntrySet): void {
    this.set = set;
  }

  public onDocEntrySetChange(set: QueryEntrySet): void {
    this.docSet = set;
  }

  public build(): void {
    // TODO build query and emit
  }
}
