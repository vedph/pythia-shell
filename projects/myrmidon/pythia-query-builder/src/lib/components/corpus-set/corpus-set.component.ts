import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Corpus } from '@myrmidon/pythia-core';
import { CorpusRefLookupService } from '@myrmidon/pythia-ui';

/**
 * Corpus set editor. This allows users pick any number of corpora.
 * Whenever the set changes, the corporaChange event is emitted with
 * the array of selected corpora.
 */
@Component({
  selector: 'pythia-corpus-set',
  templateUrl: './corpus-set.component.html',
  styleUrls: ['./corpus-set.component.css'],
})
export class CorpusSetComponent {
  /**
   * The preset user ID filter to apply to corpora lookup.
   */
  @Input()
  public userId?: string;

  /**
   * Emitted whenever the set of corpora changes.
   */
  @Output()
  public corporaChange: EventEmitter<Corpus[]>;

  public corpora: FormControl<Corpus[]>;
  public form: FormGroup;

  constructor(
    public corpusLookupService: CorpusRefLookupService,
    formBuilder: FormBuilder
  ) {
    this.corpora = formBuilder.control([], { nonNullable: true });
    this.form = formBuilder.group({
      corpora: this.corpora,
    });
    this.corporaChange = new EventEmitter<Corpus[]>();
  }

  public onCorpusChange(corpus: Corpus | null): void {
    if (!corpus) {
      return;
    }
    const corpora = [...this.corpora.value];
    if (corpora.find((c) => c.id === corpus.id)) {
      return;
    }
    corpora.push(corpus);
    this.corpora.setValue(corpora);
    this.corpora.updateValueAndValidity();
    this.corpora.markAsDirty();
    this.corporaChange.emit(this.corpora.value);
  }

  public deleteCorpus(index: number): void {
    const corpora = [...this.corpora.value];
    corpora.splice(index, 1);
    this.corpora.setValue(corpora);
    this.corpora.updateValueAndValidity();
    this.corpora.markAsDirty();
    this.corporaChange.emit(this.corpora.value);
  }

  public clear(): void {
    this.corpora.reset();
    this.corporaChange.emit(this.corpora.value);
  }
}
