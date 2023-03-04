import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { QueryBuilderTermDef } from '../../query-builder';

/**
 * Query operator's arguments as edited by QueryOpArgsComponent.
 */
export interface QueryOpArgs {
  definition: QueryBuilderTermDef;
  values?: { [key: string]: string };
}

/**
 * Query operator arguments editor.
 */
@Component({
  selector: 'pythia-query-op-args',
  templateUrl: './query-op-args.component.html',
  styleUrls: ['./query-op-args.component.css'],
})
export class QueryOpArgsComponent {
  private _args?: QueryOpArgs;

  public arguments: FormArray;
  public form: FormGroup;

  /**
   * The arguments definitions and their values. Values are edited
   * by this component.
   */
  @Input()
  public get args(): QueryOpArgs | undefined | null {
    return this._args;
  }
  public set args(value: QueryOpArgs | undefined | null) {
    if (this._args === value) {
      return;
    }
    this._args = value || undefined;
    this.updateForm();
  }

  @Output()
  public argsChange: EventEmitter<QueryOpArgs>;

  @Output()
  public editorClose: EventEmitter<any>;

  constructor(private _formBuilder: FormBuilder) {
    this.arguments = _formBuilder.array([]);
    this.form = _formBuilder.group({ arguments: this.arguments });
    // events
    this.argsChange = new EventEmitter<QueryOpArgs>();
    this.editorClose = new EventEmitter<any>();
  }

  private updateForm(): void {
    this.arguments.reset();

    if (!this._args?.definition?.args?.length) {
      this.arguments.disable();
      return;
    }

    const args = this._args.definition.args;
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
        validators.push(Validators.min(+args[i].max!));
      }
      const g = this._formBuilder.group({
        // op is just to hold the operator's definition
        op: this._formBuilder.control(args[i]),
        // value is the operator's value
        value: this._formBuilder.control(
          this._args.values![args[i].value],
          validators
        ),
      });
      this.arguments.push(g);
      this.arguments.enable();
    }

    this.form.markAsPristine();
  }

  private getValues(): { [key: string]: string } {
    const values: { [key: string]: string } = {};
    for (let i = 0; i < this.arguments.length; i++) {
      const g = this.arguments.at(i) as FormGroup;
      const value = g.controls['value'].value as string;
      if (value) {
        const op = g.controls['op'].value as QueryBuilderTermDef;
        values[op.value] = value;
      }
    }
    return values;
  }

  public close(): void {
    this.editorClose.emit();
  }

  public save(): void {
    const values = this.getValues();
    this.argsChange.emit({
      definition: this._args!.definition,
      values: values,
    });
  }
}
