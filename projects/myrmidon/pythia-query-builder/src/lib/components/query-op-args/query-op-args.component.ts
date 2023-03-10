import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  QueryBuilderTermDef,
  QueryBuilderTermDefArg,
} from '../../query-builder';

/**
 * Query operator arguments editor.
 */
@Component({
  selector: 'pythia-query-op-args',
  templateUrl: './query-op-args.component.html',
  styleUrls: ['./query-op-args.component.css'],
})
export class QueryOpArgsComponent {
  private _args?: QueryBuilderTermDefArg[];

  public arguments: FormArray;
  public form: FormGroup;

  /**
   * The arguments definitions and their values. Values are edited
   * by this component.
   */
  @Input()
  public get args(): QueryBuilderTermDefArg[] | undefined | null {
    return this._args;
  }
  public set args(value: QueryBuilderTermDefArg[] | undefined | null) {
    if (this._args === value) {
      return;
    }
    this._args = value || undefined;
    this.updateForm(this._args);
  }

  @Output()
  public argsChange: EventEmitter<QueryBuilderTermDefArg[]>;

  constructor(private _formBuilder: FormBuilder) {
    this.arguments = _formBuilder.array([]);
    this.form = _formBuilder.group({ arguments: this.arguments });
    // events
    this.argsChange = new EventEmitter<QueryBuilderTermDefArg[]>();
  }

  private updateForm(args?: QueryBuilderTermDefArg[]): void {
    this.arguments.clear();

    if (!args?.length) {
      this.arguments.disable();
      return;
    }

    for (let i = 0; i < args.length; i++) {
      const validators = [];
      if (args[i].required) {
        validators.push(Validators.required);
      }
      if (args[i].numeric) {
        validators.push(Validators.pattern('-?[0-9]+(?:.[0-9]+)?'));
      }
      if (args[i].min) {
        validators.push(Validators.min(+args[i].min!));
      }
      if (args[i].max) {
        validators.push(Validators.max(+args[i].max!));
      }
      const g = this._formBuilder.group({
        // def is just to hold the arg's definition
        def: this._formBuilder.control<QueryBuilderTermDefArg>(args[i], {
          nonNullable: true,
        }),
        // value is the arg's value being effectively edited
        value: this._formBuilder.control<string | null>(
          args[i].value ?? null,
          validators
        ),
      });
      this.arguments.push(g);
    }
    this.arguments.enable();

    this.form.markAsPristine();
  }

  private getArgs(): QueryBuilderTermDefArg[] {
    const args: QueryBuilderTermDefArg[] = [];

    for (let i = 0; i < this.arguments.length; i++) {
      const g = this.arguments.at(i) as FormGroup;
      const value = g.controls['value'].value as string;
      if (value) {
        const def = g.controls['def'].value as QueryBuilderTermDefArg;
        args.push({ ...def, value: value });
      }
    }

    return args;
  }

  public save(): void {
    this._args = this.getArgs();
    this.argsChange.emit(this._args);
    this.form.markAsPristine();
  }
}
