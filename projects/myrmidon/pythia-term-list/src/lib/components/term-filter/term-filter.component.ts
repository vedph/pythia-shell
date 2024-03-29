import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { forkJoin, from } from 'rxjs';

import {
  CorpusService,
  ProfileService,
  TermFilter,
} from '@myrmidon/pythia-api';
import { Attribute, Corpus, Profile } from '@myrmidon/pythia-core';
import {
  CorpusRefLookupService,
  ProfileRefLookupService,
} from '@myrmidon/pythia-ui';

@Component({
  selector: 'pythia-term-filter',
  templateUrl: './term-filter.component.html',
  styleUrls: ['./term-filter.component.css'],
})
export class TermFilterComponent {
  private _filter?: TermFilter;

  @Input()
  public get filter(): TermFilter | null | undefined {
    return this._filter;
  }
  public set filter(value: TermFilter | null | undefined) {
    if (this._filter === value) {
      return;
    }
    this._filter = value || undefined;
    this.updateForm(this._filter);
  }

  /**
   * Event emitted when the filter changes.
   */
  @Output()
  public filterChange: EventEmitter<TermFilter>;

  @Input()
  public disabled?: boolean;
  @Input()
  public sortable: boolean | undefined | null;
  @Input()
  public sourceHidden: boolean | undefined | null;
  @Input()
  public timeModifiedHidden: boolean | undefined | null;
  @Input()
  public docAttributes: string[];
  @Input()
  public occAttributes: string[];

  public corpus: FormControl<Corpus | null>;
  public author: FormControl<string | null>;
  public title: FormControl<string | null>;
  public source: FormControl<string | null>;
  public profile: FormControl<Profile | null>;
  public minDateValue: FormControl<number | null>;
  public maxDateValue: FormControl<number | null>;
  public minTimeModified: FormControl<Date | null>;
  public maxTimeModified: FormControl<Date | null>;
  public docAttrs: FormArray;
  public occAttrs: FormArray;
  public valuePattern: FormControl<string | null>;
  public minValueLength: FormControl<number | null>;
  public maxValueLength: FormControl<number | null>;
  public minCount: FormControl<number | null>;
  public maxCount: FormControl<number | null>;
  public sortOrder: FormControl<number>;
  public descending: FormControl<boolean>;
  public form: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _corpusService: CorpusService,
    private _profileService: ProfileService,
    public profileLookupService: ProfileRefLookupService,
    public corpusLookupService: CorpusRefLookupService
  ) {
    this.sortable = true;
    this.docAttributes = [];
    this.occAttributes = [];

    // form
    this.corpus = _formBuilder.control(null);
    this.author = _formBuilder.control(null);
    this.title = _formBuilder.control(null);
    this.source = _formBuilder.control(null);
    this.profile = _formBuilder.control(null);
    this.minDateValue = _formBuilder.control(null);
    this.maxDateValue = _formBuilder.control(null);
    this.minTimeModified = _formBuilder.control(null);
    this.maxTimeModified = _formBuilder.control(null);
    this.docAttrs = _formBuilder.array([]);
    this.occAttrs = _formBuilder.array([]);
    this.valuePattern = _formBuilder.control(null);
    this.minValueLength = _formBuilder.control(null);
    this.maxValueLength = _formBuilder.control(null);
    this.minCount = _formBuilder.control(0);
    this.maxCount = _formBuilder.control(0);
    this.sortOrder = _formBuilder.control(0, { nonNullable: true });
    this.descending = _formBuilder.control(false, { nonNullable: true });
    this.form = _formBuilder.group({
      corpus: this.corpus,
      author: this.author,
      title: this.title,
      source: this.source,
      profile: this.profile,
      minDateValue: this.minDateValue,
      maxDateValue: this.maxDateValue,
      minTimeModified: this.minTimeModified,
      maxTimeModified: this.maxTimeModified,
      docAttrs: this.docAttrs,
      occAttrs: this.occAttrs,
      valuePattern: this.valuePattern,
      minValueLength: this.minValueLength,
      maxValueLength: this.maxValueLength,
      minCount: this.minCount,
      maxCount: this.maxCount,
      sortOrder: this.sortOrder,
      descending: this.descending,
    });

    // events
    this.filterChange = new EventEmitter<TermFilter>();
  }

  private parseAttributes(csv?: string): Attribute[] {
    if (!csv) {
      return [];
    }
    const pairRegex = /^\s*([^=]+)=(.*)\s*/;
    return csv
      .split(',')
      .map((p) => {
        const m = pairRegex.exec(p);
        return m ? { targetId: 0, name: m[1], value: m[2] } : null;
      })
      .filter((a) => a) as Attribute[];
  }

  private updateAttributes(csv: string | undefined, token: boolean): void {
    const attributes: FormArray = token ? this.occAttrs : this.docAttrs;

    attributes.reset();
    const attrs = this.parseAttributes(csv);
    for (let i = 0; i < attrs.length; i++) {
      attributes.push(this.getAttributeGroup(attrs[i]));
    }
  }

  private updateForm(filter?: TermFilter): void {
    if (!filter) {
      this.form.reset();
      return;
    }
    this.author.setValue(filter.author || null);
    this.title.setValue(filter.title || null);
    this.source.setValue(filter.source || null);
    this.minDateValue.setValue(filter.minDateValue || null);
    this.maxDateValue.setValue(filter.maxDateValue || null);
    this.minTimeModified.setValue(filter.minTimeModified || null);
    this.maxTimeModified.setValue(filter.maxTimeModified || null);
    this.valuePattern.setValue(filter.valuePattern || null);
    this.minValueLength.setValue(filter.minValueLength || null);
    this.maxValueLength.setValue(filter.maxValueLength || null);
    this.minCount.setValue(filter.minCount || null);
    this.maxCount.setValue(filter.maxCount || null);
    this.sortOrder.setValue(filter.sortOrder || 0);
    this.descending.setValue(filter.descending ? true : false);

    this.updateAttributes(filter.docAttributes, false);
    this.updateAttributes(filter.occAttributes, true);

    forkJoin({
      corpus: filter.corpusId
        ? this._corpusService.getCorpus(filter.corpusId, true)
        : from([] as any),
      profile: filter.profileId
        ? this._profileService.getProfile(filter.profileId)
        : from([] as any),
    }).subscribe((result) => {
      this.corpus.setValue(result.corpus as Corpus);
      this.profile.setValue(result.profile as Profile);
      this.form.markAsPristine();
    });
  }

  public onCorpusChange(corpus: Corpus | null): void {
    this.corpus.setValue(corpus);
  }

  public onCorpusRemoved(): void {
    this.corpus.reset();
  }

  public onProfileChange(profile: Profile | null): void {
    this.profile.setValue(profile);
  }

  public onProfileRemoved(): void {
    this.profile.reset();
  }

  //#region Attributes
  private getAttributeGroup(item?: Attribute): FormGroup {
    return this._formBuilder.group({
      name: this._formBuilder.control(item?.name, Validators.required),
      value: this._formBuilder.control(item?.value, Validators.maxLength(100)),
    });
  }

  public addAttribute(item: Attribute | undefined, token: boolean): void {
    const attributes: FormArray = token ? this.occAttrs : this.docAttrs;

    attributes.push(this.getAttributeGroup(item));
    attributes.markAsDirty();
  }

  public removeAttribute(index: number, token: boolean): void {
    const attributes: FormArray = token ? this.occAttrs : this.docAttrs;

    attributes.removeAt(index);
    attributes.markAsDirty();
  }

  private getAttributes(token: boolean): Attribute[] | undefined {
    const attributes: FormArray = token ? this.occAttrs : this.docAttrs;

    const entries: Attribute[] = [];
    for (let i = 0; i < attributes.length; i++) {
      const g = attributes.at(i) as FormGroup;
      entries.push({
        targetId: 0, // not used
        name: g.controls['name'].value?.trim(),
        value: g.controls['name'].value?.trim(),
      });
    }
    return entries.length ? entries : undefined;
  }
  //#endregion

  private getFilter(): TermFilter {
    return {
      corpusId: this.corpus.value?.id,
      author: this.author.value?.trim(),
      title: this.title.value?.trim(),
      source: this.source.value?.trim(),
      profileId: this.profile.value?.id,
      minDateValue: this.minDateValue.value || undefined,
      maxDateValue: this.maxDateValue.value || undefined,
      minTimeModified: this.minTimeModified.value || undefined,
      maxTimeModified: this.maxTimeModified.value || undefined,
      docAttributes: this.getAttributes(false)
        ?.map((a) => `${a.name}=${a.value}`)
        ?.join(','),
      occAttributes: this.getAttributes(true)
        ?.map((a) => `${a.name}=${a.value}`)
        ?.join(','),
      valuePattern: this.valuePattern.value || undefined,
      minValueLength: this.minValueLength.value || undefined,
      maxValueLength: this.maxValueLength.value || undefined,
      minCount: this.minCount.value || undefined,
      maxCount: this.maxCount.value || undefined,
      sortOrder: this.sortOrder.value,
      descending: this.descending.value ? true : false,
    };
  }

  public reset(): void {
    this.form.reset();
    this._filter = {};
    this.filterChange.emit(this._filter);
  }

  public apply(): void {
    if (this.form.invalid) {
      return;
    }
    this._filter = this.getFilter();
    this.filterChange.emit(this._filter);
  }
}
