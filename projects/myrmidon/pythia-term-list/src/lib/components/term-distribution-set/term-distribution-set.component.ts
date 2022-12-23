import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { TermDistribution, TermDistributionSet } from '@myrmidon/pythia-api';

import { TermListRepository } from '../../term-list.repository';
import { IndexTerm } from '@myrmidon/pythia-core';

@Component({
  selector: 'pythia-term-distribution-set',
  templateUrl: './term-distribution-set.component.html',
  styleUrls: ['./term-distribution-set.component.css'],
})
export class TermDistributionSetComponent implements OnInit {
  private _busy: boolean | undefined;
  private _termId: number | undefined;
  private _docAttributes: string[];
  private _occAttributes: string[];

  @Input()
  public get termId(): number | undefined {
    return this._termId;
  }
  public set termId(value: number | undefined) {
    if (this._termId !== value) {
      this._termId = value;
      this.load();
    }
  }

  public limit: FormControl;
  public presetLimits: number[];

  public term$: Observable<IndexTerm | undefined>;
  public docAttributes$: Observable<string[]>;
  public occAttributes$: Observable<string[]>;
  public set$: Observable<TermDistributionSet | undefined>;
  public docDistributions: TermDistribution[];
  public occDistributions: TermDistribution[];

  constructor(
    formBuilder: FormBuilder,
    private _repository: TermListRepository
  ) {
    this._docAttributes = [];
    this._occAttributes = [];
    this.term$ = _repository.activeTerm$;
    this.docAttributes$ = _repository.docAttributes$;
    this.occAttributes$ = _repository.occAttributes$;
    this.set$ = _repository.termDistributionSet$;
    this.presetLimits = [3, 5, 10, 25, 50];
    this.limit = formBuilder.control(10, { nonNullable: true });
    this.docDistributions = [];
    this.occDistributions = [];
  }

  public ngOnInit(): void {
    this.set$.subscribe((set) => {
      if (!set) {
        this.docDistributions = [];
        this.occDistributions = [];
      } else {
        this.docDistributions = Object.getOwnPropertyNames(
          set.docFrequencies
        ).map((n) => set.docFrequencies[n]);
        this.occDistributions = Object.getOwnPropertyNames(
          set.occFrequencies
        ).map((n) => set.occFrequencies[n]);
      }
    });
  }

  public onDocNamesChange(names: string[]): void {
    this._docAttributes = names;
  }

  public onOccNamesChange(names: string[]): void {
    this._occAttributes = names;
  }

  public load(): void {
    if (this._busy || !this._termId) {
      return;
    }
    this._repository.loadDistributionSet(
      this._termId,
      this._docAttributes,
      this._occAttributes,
      this.limit.value
    );
  }
}
