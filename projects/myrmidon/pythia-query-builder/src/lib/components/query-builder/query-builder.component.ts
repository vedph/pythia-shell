import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgToolsValidators } from '@myrmidon/ng-tools';

import { Corpus } from '@myrmidon/pythia-core';

import { QueryBuilderEntry } from '../../query-builder';

/**
 * Query builder component.
 */
@Component({
  selector: 'pythia-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css'],
})
export class QueryBuilderComponent {
  // query entries
  public entries: FormControl<QueryBuilderEntry[]>;
  // query scope
  public corpora: FormControl<Corpus[]>;
  public docEntries: FormControl<QueryBuilderEntry[]>;
  public form: FormGroup;

  /**
   * Emitted whenever a query is built.
   */
  @Output()
  public queryChange: EventEmitter<string>;

  constructor(formBuilder: FormBuilder) {
    this.entries = formBuilder.control([], {
      validators: NgToolsValidators.strictMinLengthValidator(1),
      nonNullable: true,
    });
    this.corpora = formBuilder.control([], { nonNullable: true });
    this.docEntries = formBuilder.control([], { nonNullable: true });
    this.form = formBuilder.group({
      entries: this.entries,
      corpora: this.corpora,
      docEntries: this.docEntries,
    });
    // events
    this.queryChange = new EventEmitter<string>();
  }

  public onCorporaChange(corpora: Corpus[]): void {
    this.corpora.setValue(corpora);
    this.corpora.updateValueAndValidity();
    this.corpora.markAsDirty();
  }
}
