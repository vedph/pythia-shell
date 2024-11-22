import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
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
  DocumentFilter,
  ProfileService,
} from '@myrmidon/pythia-api';
import { Attribute, Corpus, Profile } from '@myrmidon/pythia-core';
import {
  CorpusRefLookupService,
  ProfileRefLookupService,
} from '@myrmidon/pythia-ui';

/**
 * A list of available document filters in DocumentFilterComponent.
 */
export interface DocumentFilters {
  corpus?: boolean;
  author?: boolean;
  title?: boolean;
  source?: boolean;
  profile?: boolean;
  date?: boolean;
  modified?: boolean;
  attributes?: boolean;
}

@Component({
    selector: 'pythia-document-filter',
    templateUrl: './document-filter.component.html',
    styleUrls: ['./document-filter.component.css'],
    standalone: false
})
export class DocumentFilterComponent {
  private _filter?: DocumentFilter;

  /**
   * The filter.
   */
  @Input()
  public get filter(): DocumentFilter | null | undefined {
    return this._filter;
  }
  public set filter(value: DocumentFilter | null | undefined) {
    if (this._filter === value) {
      return;
    }
    this._filter = value || undefined;
    this.updateForm(this._filter);
  }

  /**
   * The list of available document attributes.
   */
  @Input()
  public attributes: string[] | undefined;

  /**
   * Event emitted when the filter changes.
   */
  @Output()
  public filterChange: EventEmitter<DocumentFilter>;

  /**
   * The list of document filters to be hidden.
   */
  @Input()
  public hiddenFilters?: DocumentFilters;

  /**
   * Whether the filter is disabled.
   */
  @Input()
  public disabled?: boolean;

  /**
   * Whether the filter is sortable.
   */
  @Input()
  public sortable?: boolean;

  public corpus: FormControl<Corpus | null>;
  public author: FormControl<string | null>;
  public title: FormControl<string | null>;
  public source: FormControl<string | null>;
  public profile: FormControl<Profile | null>;
  public minDateValue: FormControl<number | null>;
  public maxDateValue: FormControl<number | null>;
  public minTimeModified: FormControl<Date | null>;
  public maxTimeModified: FormControl<Date | null>;
  public attrs: FormArray;
  public sortOrder: FormControl<number>;
  public descending: FormControl<boolean>;
  public form: FormGroup;

  constructor(
    public corpusLookupService: CorpusRefLookupService,
    public profileLookupService: ProfileRefLookupService,
    private _corpusService: CorpusService,
    private _profileService: ProfileService,
    private _formBuilder: FormBuilder
  ) {
    this.sortable = true;

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
    this.attrs = _formBuilder.array([]);
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
      attrs: this.attrs,
      sortOrder: this.sortOrder,
      descending: this.descending,
    });
    // events
    this.filterChange = new EventEmitter<DocumentFilter>();
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

  private updateForm(filter?: DocumentFilter | null): void {
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
    this.sortOrder.setValue(filter.sortOrder || 0);
    this.descending.setValue(filter.descending ? true : false);

    this.attrs.clear({ emitEvent: false });
    const attrs = this.parseAttributes(filter.attributes);
    for (let i = 0; i < attrs.length; i++) {
      this.attrs.push(this.getAttributeGroup(attrs[i]));
    }

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
    this.corpus.setValue(corpus || null);
  }

  public removeCorpus(): void {
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

  public addAttribute(item?: Attribute): void {
    this.attrs.push(this.getAttributeGroup(item));
    this.attrs.markAsDirty();
  }

  public removeAttribute(index: number): void {
    this.attrs.removeAt(index);
    this.attrs.markAsDirty();
  }

  private getAttributes(): Attribute[] | undefined {
    const entries: Attribute[] = [];
    for (let i = 0; i < this.attrs.length; i++) {
      const g = this.attrs.at(i) as FormGroup;
      entries.push({
        targetId: 0, // not used
        name: g.controls['name'].value?.trim(),
        value: g.controls['value'].value?.trim(),
      });
    }
    return entries.length ? entries : undefined;
  }
  //#endregion

  private getFilter(): DocumentFilter {
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
      attributes: this.getAttributes()
        ?.map((a) => `${a.name}=${a.value}`)
        ?.join(','),
      sortOrder: this.sortOrder.value,
      descending: this.descending.value ? true : false,
    };
  }

  public reset(): void {
    this.attrs.clear({ emitEvent: false });
    this.form.reset();
    this._filter = {};
    this.filterChange.emit(this._filter);
  }

  public apply(): void {
    this._filter = this.getFilter();
    this.filterChange.emit(this._filter);
  }
}
