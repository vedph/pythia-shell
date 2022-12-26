import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { TermDistribution, TermDistributionSet } from '@myrmidon/pythia-api';

import { IndexTerm } from '@myrmidon/pythia-core';
import { TermListRepository } from '../../term-list.repository';

@Component({
  selector: 'pythia-term-distribution-set',
  templateUrl: './term-distribution-set.component.html',
  styleUrls: ['./term-distribution-set.component.css'],
})
export class TermDistributionSetComponent implements OnInit {
  private _busy: boolean | undefined;
  private _termId: number | undefined;
  // attrs cache for applying settings later
  private _docAttributes: string[];
  private _occAttributes: string[];

  public selectedTabIndex: number;

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
  public interval: FormControl;
  public presetLimits: number[];
  public presetIntervals: number[];

  public term$: Observable<IndexTerm | undefined>;
  public docAttributes$: Observable<string[]>;
  public occAttributes$: Observable<string[]>;
  public setDocAttributes$: Observable<string[]>;
  public setOccAttributes$: Observable<string[]>;
  public set$: Observable<TermDistributionSet | undefined>;
  public docDistributions: TermDistribution[];
  public occDistributions: TermDistribution[];

  constructor(
    formBuilder: FormBuilder,
    private _repository: TermListRepository
  ) {
    this.selectedTabIndex = 0;
    this._docAttributes = [];
    this._occAttributes = [];
    this.term$ = _repository.activeTerm$;
    this.docAttributes$ = _repository.docAttributes$;
    this.occAttributes$ = _repository.occAttributes$;
    this.setDocAttributes$ = _repository.setDocAttributes$;
    this.setOccAttributes$ = _repository.setOccAttributes$;
    this.set$ = _repository.termDistributionSet$;
    this.docDistributions = [];
    this.occDistributions = [];

    this.limit = formBuilder.control(10, { nonNullable: true });
    this.presetLimits = [3, 5, 10, 25, 50];
    this.interval = formBuilder.control(0, { nonNullable: true });
    this.presetIntervals = [0, 5, 10, 25, 50, 100];
  }

  private getDistributions(f: {
    [key: string]: TermDistribution;
  }): TermDistribution[] {
    const distributions: TermDistribution[] = [];
    Object.getOwnPropertyNames(f).forEach((name) => {
      distributions.push(f[name]);
    });
    return distributions;
  }

  public ngOnInit(): void {
    this.set$.subscribe((set) => {
      if (!set) {
        this.docDistributions = [];
        this.occDistributions = [];
      } else {
        this.docDistributions = this.getDistributions(set.docFrequencies);
        this.occDistributions = this.getDistributions(set.occFrequencies);
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
      this.limit.value,
      this.interval.value
    );
    this.selectedTabIndex = 0;
  }
}
