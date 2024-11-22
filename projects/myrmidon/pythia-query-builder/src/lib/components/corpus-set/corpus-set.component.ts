import { Component, EventEmitter, Input, Output } from '@angular/core';

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
    standalone: false
})
export class CorpusSetComponent {
  private _corpora: Corpus[];

  /**
   * The preset user ID filter to apply to corpora lookup.
   */
  @Input()
  public userId?: string;

  @Input()
  public get corpora(): Corpus[] {
    return this._corpora;
  }
  public set corpora(value: Corpus[]) {
    if (this._corpora === value) {
      return;
    }
    this._corpora = value;
  }

  /**
   * Emitted whenever the set of corpora changes.
   */
  @Output()
  public corporaChange: EventEmitter<Corpus[]>;

  constructor(public corpusLookupService: CorpusRefLookupService) {
    this._corpora = [];
    this.corporaChange = new EventEmitter<Corpus[]>();
  }

  public onCorpusChange(corpus: Corpus | null): void {
    if (!corpus) {
      return;
    }
    const corpora = [...this.corpora];
    if (corpora.find((c) => c.id === corpus.id)) {
      return;
    }
    corpora.push(corpus);
    this.corpora = corpora;
    this.corporaChange.emit(this.corpora);
  }

  public deleteCorpus(index: number): void {
    const corpora = [...this.corpora];
    corpora.splice(index, 1);
    this.corpora = corpora;
    this.corporaChange.emit(this.corpora);
  }

  public clear(): void {
    this.corpora = [];
    this.corporaChange.emit(this.corpora);
  }
}
