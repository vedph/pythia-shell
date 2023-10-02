import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { TermDistribution } from '@myrmidon/pythia-api';
import { AppSettingsService, IndexTerm } from '@myrmidon/pythia-core';

import {
  TermListDistributionSet,
  TermListRepository,
} from '../../term-list.repository';

/**
 * A set of term's frequencies distributions.
 */
@Component({
  selector: 'pythia-term-distribution-set',
  templateUrl: './term-distribution-set.component.html',
  styleUrls: ['./term-distribution-set.component.css'],
})
export class TermDistributionSetComponent implements OnInit {
  private _term?: IndexTerm;
  // picked attributes
  private _docAttributes: string[];
  private _occAttributes: string[];

  public selectedTabIndex: number;

  /**
   * The index term to show the distribution for. When this is set,
   * the distributions set is loaded from the repository.
   */
  @Input()
  public get term(): IndexTerm | undefined {
    return this._term;
  }
  public set term(value: IndexTerm | undefined) {
    if (this._term !== value) {
      this._term = value;
      this.load();
    }
  }

  public limit: FormControl;
  public interval: FormControl;
  public presetLimits: number[];
  public presetIntervals: number[];

  // repository observables
  public loading$: Observable<boolean>;
  public docAttributes$: Observable<string[]>;
  public occAttributes$: Observable<string[]>;
  public set$: Observable<TermListDistributionSet | undefined>;

  public docDistributions: TermDistribution[];
  public occDistributions: TermDistribution[];

  constructor(
    formBuilder: FormBuilder,
    private _repository: TermListRepository,
    settings: AppSettingsService
  ) {
    this.selectedTabIndex = 0;
    this._docAttributes = [];
    this._occAttributes = [];
    this.loading$ = _repository.loading$;
    this.docAttributes$ = _repository.docAttributes$;
    this.occAttributes$ = _repository.occAttributes$;
    this.set$ = _repository.termSet$;

    this.docDistributions = [];
    this.occDistributions = [];

    this.limit = formBuilder.control(settings.termiDistrLimit, {
      nonNullable: true,
    });
    this.presetLimits = settings.presetTermDistrLimits;
    this.interval = formBuilder.control(settings.termDistrInterval, {
      nonNullable: true,
    });
    this.presetIntervals = settings.presetTermDistrIntervals;
    if (
      settings.termDistrDocNames.length ||
      settings.termDistrOccNames.length
    ) {
      this._repository.setPresetAttributes(
        settings.termDistrDocNames,
        settings.termDistrOccNames
      );
      this._docAttributes = settings.termDistrDocNames;
      this._occAttributes = settings.termDistrOccNames;
    }
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
        this.docDistributions = this.getDistributions(set.value.docFrequencies);
        this.occDistributions = this.getDistributions(set.value.occFrequencies);
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
    if (!this._term) {
      return;
    }
    this._repository.loadTermDistributionSet(
      this._term,
      this._docAttributes,
      this._occAttributes,
      this.limit.value,
      this.interval.value
    );
    this.selectedTabIndex = 0;
  }
}
