import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CorpusFilter } from '@myrmidon/pythia-api';

@Component({
  selector: 'pythia-corpus-filter',
  templateUrl: './corpus-filter.component.html',
  styleUrls: ['./corpus-filter.component.css'],
})
export class CorpusFilterComponent {
  private _filter?: CorpusFilter;

  @Input()
  public get filter(): CorpusFilter | null | undefined {
    return this._filter;
  }
  public set filter(value: CorpusFilter | null | undefined) {
    if (this._filter === value) {
      return;
    }
    this._filter = value || undefined;
    this.updateForm(this._filter);
  }

  @Input()
  public disabled: boolean | undefined;

  /**
   * Event emitted when the filter changes.
   */
  @Output()
  public filterChange: EventEmitter<CorpusFilter>;

  public id: FormControl<string | null>;
  public title: FormControl<string | null>;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    // form
    this.id = formBuilder.control(null);
    this.title = formBuilder.control(null);
    this.form = formBuilder.group({
      id: this.id,
      title: this.title,
    });
    // event
    this.filterChange = new EventEmitter<CorpusFilter>();
  }

  private updateForm(filter?: CorpusFilter | null): void {
    if (!filter) {
      this.form.reset();
      return;
    }
    this.id.setValue(filter.id || null);
    this.title.setValue(filter.title || null);
    this.form.markAsPristine();
  }

  private getFilter(): CorpusFilter {
    return {
      id: this.id.value?.trim(),
      title: this.title.value?.trim(),
    };
  }

  public reset(): void {
    this.form.reset();
    this._filter = {};
    this.filterChange.emit(this._filter);
  }

  public apply(): void {
    this._filter = this.getFilter();
    this.filterChange.emit(this._filter);
  }
}
