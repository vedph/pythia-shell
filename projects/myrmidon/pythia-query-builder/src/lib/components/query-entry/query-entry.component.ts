import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, Subscription } from 'rxjs';

import {
  QueryBuilderEntry,
  QueryBuilderTermDef,
  QueryEntryType,
  QUERY_OP_DEFS,
} from '../../query-builder';

/**
 * Query entry editor component. This edits a clause or just a logical term
 * like logical operators or brackets.
 */
@Component({
  selector: 'pythia-query-entry',
  templateUrl: './query-entry.component.html',
  styleUrls: ['./query-entry.component.css'],
})
export class QueryEntryComponent implements OnInit, OnDestroy {
  private readonly _subs: Subscription[];
  private _entry?: QueryBuilderEntry;
  // clause form
  public attribute: FormControl<QueryBuilderTermDef | null>;
  public operator: FormControl<QueryBuilderTermDef | null>;
  public value: FormControl<string>;
  public args: FormArray;
  public clauseForm: FormGroup;
  // outer form
  public type: FormControl<QueryEntryType>;
  public form: FormGroup;

  /**
   * The attributes definitions to use. This is meant to be set only once.
   */
  @Input()
  public attrDefinitions: QueryBuilderTermDef[];

  /**
   * The operator definitions to use. This is meant to be set only once
   * and just defaults to QUERY_OP_DEFS.
   */
  @Input()
  public opDefinitions: QueryBuilderTermDef[];

  @Input()
  public get entry(): QueryBuilderEntry | undefined | null {
    return this._entry;
  }
  public set entry(value: QueryBuilderEntry | undefined | null) {
    if (this._entry === value) {
      return;
    }
    this._entry = value || undefined;
    this.updateForm(this._entry);
  }

  /**
   * Emitted when the entry is saved.
   */
  @Output()
  public entryChange: EventEmitter<QueryBuilderEntry>;

  constructor(private _formBuilder: FormBuilder) {
    this._subs = [];
    this.attrDefinitions = [];
    this.opDefinitions = QUERY_OP_DEFS;
    // forms
    this.attribute = _formBuilder.control(null, Validators.required);
    this.operator = _formBuilder.control(null, Validators.required);
    this.value = _formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    });
    this.args = _formBuilder.array([]);
    this.clauseForm = _formBuilder.group({
      attribute: this.attribute,
      operator: this.operator,
      value: this.value,
      args: this.args,
    });

    this.type = _formBuilder.control(QueryEntryType.Clause, {
      validators: Validators.required,
      nonNullable: true,
    });
    this.form = _formBuilder.group({
      type: this.type,
      clause: this.clauseForm,
    });
    // events
    this.entryChange = new EventEmitter<QueryBuilderEntry>();
  }

  public ngOnInit(): void {
    // when type changes, enable or disable clause form
    this._subs.push(
      this.type.valueChanges.pipe(distinctUntilChanged()).subscribe((t) => {
        if (t === QueryEntryType.Clause) {
          this.clauseForm.enable();
        } else {
          this.clauseForm.disable();
        }
      })
    );

    // when operator changes, update args array
    this._subs.push(
      this.operator.valueChanges.pipe(distinctUntilChanged()).subscribe((o) => {
        this.updateOperatorArgs();
      })
    );
  }

  public ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
  }

  private updateOperatorArgs(): void {
    const op = this.operator.value;
    this.args.reset();

    if (!op?.args) {
      this.args.disable();
      return;
    }
    for (let i = 0; i < op.args.length; i++) {
      const validators = [];
      if (op.args[i].required) {
        validators.push(Validators.required);
      }
      if (op.args[i].numeric) {
        validators.push(Validators.pattern('-?[0-9]+(?:.[0-9]+)?'));
      }
      if (op.args[i].min) {
        validators.push(Validators.min(+op.args[i].min!));
      }
      if (op.args[i].max) {
        validators.push(Validators.min(+op.args[i].max!));
      }
      const g = this._formBuilder.group({
        operator: op,
        value: this._formBuilder.control('', validators),
      });
      this.args.push(g);
      this.args.enable();
    }
  }

  private updateForm(entry?: QueryBuilderEntry): void {
    if (!entry) {
      this.form.reset();
      return;
    }
    this.type.setValue(entry.type);
    setTimeout(() => {
      if (!entry.clause) {
        this.clauseForm.reset();
      } else {
        this.attribute.setValue(
          this.attrDefinitions.find(
            (d) => d.value === entry.clause!.attribute
          ) || null
        );
        this.operator.setValue(
          this.opDefinitions.find((d) => d.value === entry.clause!.operator) ||
            null
        );
        this.value.setValue(entry.clause.value);
        this.clauseForm.markAsPristine();
      }
    });
    this.form.markAsPristine();
  }

  private getEntry(): QueryBuilderEntry {
    if (this.type.value === QueryEntryType.Clause) {
      return {
        type: QueryEntryType.Clause,
        clause: {
          attribute: this.attribute.value!.value,
          operator: this.operator.value!.value,
          value: this.value.value,
        },
      };
    } else {
      return {
        type: this.type.value,
      };
    }
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    const entry = this.getEntry();
    this.entryChange.emit(entry);
  }
}
