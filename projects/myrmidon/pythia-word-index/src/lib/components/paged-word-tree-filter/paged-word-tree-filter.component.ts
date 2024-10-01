import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Optional,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { WordFilter, WordSortOrder } from '@myrmidon/pythia-api';

@Component({
  selector: 'pythia-paged-word-tree-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './paged-word-tree-filter.component.html',
  styleUrl: './paged-word-tree-filter.component.scss',
})
export class PagedWordTreeFilterComponent {
  private _filter?: WordFilter;

  @Input()
  public get filter(): WordFilter | null | undefined {
    return this._filter;
  }
  public set filter(value: WordFilter | null | undefined) {
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
  public filterChange: EventEmitter<WordFilter>;

  public language: FormControl<string | null>;
  public valuePattern: FormControl<string | null>;
  public minValueLength: FormControl<number>;
  public maxValueLength: FormControl<number>;
  public minCount: FormControl<number>;
  public maxCount: FormControl<number>;
  public sortOrder: FormControl<WordSortOrder>;
  public descending: FormControl<boolean>;
  public form: FormGroup;

  public wrapped?: boolean;

  constructor(
    formBuilder: FormBuilder,
    // for dialog wrapper:
    @Optional()
    public dialogRef: MatDialogRef<PagedWordTreeFilterComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {
    // form
    this.language = formBuilder.control<string | null>(null);
    this.valuePattern = formBuilder.control<string | null>(null);
    this.minValueLength = formBuilder.control<number>(0, { nonNullable: true });
    this.maxValueLength = formBuilder.control<number>(0, { nonNullable: true });
    this.minCount = formBuilder.control<number>(0, { nonNullable: true });
    this.maxCount = formBuilder.control<number>(0, { nonNullable: true });
    this.sortOrder = formBuilder.control<WordSortOrder>(WordSortOrder.Default, {
      nonNullable: true,
    });
    this.descending = formBuilder.control<boolean>(false, {
      nonNullable: true,
    });
    this.form = formBuilder.group({
      language: this.language,
      valuePattern: this.valuePattern,
      minValueLength: this.minValueLength,
      maxValueLength: this.maxValueLength,
      minCount: this.minCount,
      maxCount: this.maxCount,
      sortOrder: this.sortOrder,
      descending: this.descending,
    });
    // events
    this.filterChange = new EventEmitter<WordFilter>();
    // dialog
    this.wrapped = dialogRef ? true : false;
    // bind dialog data if any
    if (data) {
      this.filter = data.filter;
    }
  }

  private updateForm(filter?: WordFilter | null): void {
    if (!filter) {
      this.form.reset();
      return;
    }

    this.language.setValue(filter.language ?? null);
    this.valuePattern.setValue(filter.valuePattern ?? null);
    this.minValueLength.setValue(filter.minValueLength ?? 0);
    this.maxValueLength.setValue(filter.maxValueLength ?? 0);
    this.minCount.setValue(filter.minCount ?? 0);
    this.maxCount.setValue(filter.maxCount ?? 0);
    this.sortOrder.setValue(filter.sortOrder ?? WordSortOrder.Default);
    this.descending.setValue(filter.isSortDescending ?? false);
    this.form.markAsPristine();
  }

  private getFilter(): WordFilter {
    return {
      language: this.language.value ?? undefined,
      valuePattern: this.valuePattern.value ?? undefined,
      minValueLength: this.minValueLength.value || undefined,
      maxValueLength: this.maxValueLength.value || undefined,
      minCount: this.minCount.value || undefined,
      maxCount: this.maxCount.value || undefined,
      sortOrder: this.sortOrder.value,
      isSortDescending: this.descending.value,
    };
  }

  public reset(): void {
    this.form.reset();
    this._filter = {};
    this.filterChange.emit(this._filter);
    this.dialogRef?.close(null);
  }

  public apply(): void {
    this._filter = this.getFilter();
    this.filterChange.emit(this._filter);
    this.dialogRef?.close(this._filter);
  }
}
