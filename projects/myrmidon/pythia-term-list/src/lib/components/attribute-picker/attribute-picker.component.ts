import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

/**
 * Attribute picker. This dumb control receives a list of attribute names,
 * and allows users to pick any number of them.
 */
@Component({
  selector: 'pythia-attribute-picker',
  templateUrl: './attribute-picker.component.html',
  styleUrls: ['./attribute-picker.component.css'],
})
export class AttributePickerComponent {
  private _names: string[];

  @Input()
  public label: string;

  @Input()
  public availableNames: string[];

  @Input()
  public defaultNames: string[];

  @Input()
  public get names(): string[] {
    return this._names;
  }
  public set names(value: string[]) {
    this._names = value;
  }

  @Output()
  public namesChange: EventEmitter<string[]>;

  public selectedName: FormControl;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.label = 'attributes';
    this.availableNames = [];
    this._names = [];
    this.defaultNames = [];
    // form
    this.selectedName = formBuilder.control(null);
    this.form = formBuilder.group({
      selectedName: this.selectedName,
    });
    // events
    this.namesChange = new EventEmitter<string[]>();
  }

  public reset(): void {
    this.names = this.defaultNames;
    this.namesChange.emit(this.names);
  }

  public addName(): void {
    const name = this.selectedName.value;
    if (!name || this.names.includes(name)) {
      return;
    }
    const names = [...this.names];
    names.push(name);
    names.sort();
    this.names = names;
    this.namesChange.emit(this.names);
  }

  public removeName(name: string): void {
    const i = this.names.indexOf(name);
    if (i === -1) {
      return;
    }
    const names = [...this.names];
    names.splice(i, 1);
    this.names = names;
    this.namesChange.emit(this.names);
  }
}
