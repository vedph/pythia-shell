import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, Subscription } from 'rxjs';

import {
  QueryBuilderEntry,
  QueryBuilderTermDef,
  QUERY_OP_DEFS,
  QUERY_PAIR_OP_DEFS,
} from '../../query-builder';
import { QueryOpArgs } from '../query-op-args/query-op-args.component';

/**
 * Used only in this component to group definitions.
 */
interface GroupedQueryBuilderTermDefs {
  [key: string]: QueryBuilderTermDef[];
}

/**
 * Used only in this component to let user select entry type.
 */
const ENTRY_TYPES: QueryBuilderTermDef[] = [
  {
    value: '-',
    label: 'pair',
    group: '',
  },
  ...QUERY_OP_DEFS,
];

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
  private _attrDefinitions: QueryBuilderTermDef[];
  private _entry?: QueryBuilderEntry;
  // clause form
  public attribute: FormControl<QueryBuilderTermDef | null>;
  public operator: FormControl<QueryBuilderTermDef | null>;
  public value: FormControl<string>;
  public pairArgs: FormControl<QueryOpArgs | null>;
  public pairForm: FormGroup;
  // outer form
  public type: FormControl<QueryBuilderTermDef>;
  public args: FormControl<QueryOpArgs | null>;
  public form: FormGroup;

  public entryTypes = ENTRY_TYPES;
  public opGroups: GroupedQueryBuilderTermDefs;
  public attrGroups: GroupedQueryBuilderTermDefs;

  /**
   * The attributes definitions to use. This is meant to be set only once.
   */
  @Input()
  public get attrDefinitions(): QueryBuilderTermDef[] {
    return this._attrDefinitions;
  }
  public set attrDefinitions(value: QueryBuilderTermDef[]) {
    if (this._attrDefinitions === value) {
      return;
    }
    this._attrDefinitions = value;
    this.attrGroups = this.groupByKey(value, 'group');
  }

  /**
   * The entry being edited.
   */
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

  /**
   * Emitted when the user requests to close the editor.
   */
  @Output()
  public editorClose: EventEmitter<any>;

  constructor(private _formBuilder: FormBuilder) {
    this._subs = [];
    this._attrDefinitions = [];
    this.attrGroups = {};
    this.opGroups = this.groupByKey(
      QUERY_PAIR_OP_DEFS,
      'group'
    ) as GroupedQueryBuilderTermDefs;
    // pair form
    this.attribute = _formBuilder.control(null, Validators.required);
    this.operator = _formBuilder.control(null, Validators.required);
    this.value = _formBuilder.control('', {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    });
    this.pairArgs = _formBuilder.control(null);
    this.pairForm = _formBuilder.group({
      attribute: this.attribute,
      operator: this.operator,
      value: this.value,
      pairArgs: this.pairArgs,
    });

    // main form
    this.type = _formBuilder.control(ENTRY_TYPES[0], { nonNullable: true });
    this.args = _formBuilder.control(null);
    this.form = _formBuilder.group({
      type: this.type,
      args: this.args,
      clause: this.pairForm,
    });
    // events
    this.entryChange = new EventEmitter<QueryBuilderEntry>();
    this.editorClose = new EventEmitter<any>();
  }

  private groupByKey(array: Array<any>, key: string): { [key: string]: any[] } {
    // https://stackoverflow.com/questions/40774697/how-can-i-group-an-array-of-objects-by-key
    return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
    }, {});
  }

  public ngOnInit(): void {
    // when type changes, enable or disable pair form
    this._subs.push(
      this.type.valueChanges.pipe(distinctUntilChanged()).subscribe((def) => {
        if (def.value) {
          this.pairForm.enable();
        } else {
          this.pairForm.disable();
          // update args
        }
      })
    );

    // when pair operator changes, update its args
    this._subs.push(
      this.operator.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((op) => {
          if (op?.args) {
            this.pairArgs.setValue({
              definition: op,
              values: this.entry?.opArgs,
            });
          } else {
            this.pairArgs.setValue(null);
          }
          this.pairArgs.updateValueAndValidity();
          this.pairArgs.markAsDirty();
        })
    );
  }

  public ngOnDestroy(): void {
    this._subs.forEach((s) => s.unsubscribe());
  }

  private updateForm(entry?: QueryBuilderEntry): void {
    if (!entry) {
      this.form.reset();
      return;
    }
    this.type.setValue(
      entry.pair
        ? ENTRY_TYPES[0]
        : ENTRY_TYPES.find((t) => t.value === entry.operator!.value)!
    );
    setTimeout(() => {
      if (!entry.pair) {
        this.pairForm.reset();
      } else {
        this.attribute.setValue(entry.pair!.attribute || null);
        this.operator.setValue(entry.pair!.operator || null);
        this.value.setValue(entry.pair.value);
        this.pairForm.markAsPristine();
      }
      this.form.markAsPristine();
    });
  }

  private getEntry(): QueryBuilderEntry {
    if (this.type.value.value === '-') {
      return {
        pair: {
          attribute: this.attribute.value!,
          operator: this.operator.value!,
          value: this.value.value,
        },
      };
    } else {
      return {
        operator: this.type.value as any,
      };
    }
  }

  public close(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    const entry = this.getEntry();
    this.entryChange.emit(entry);
  }
}
