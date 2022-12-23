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
  public get names(): string[] {
    return this._names;
  }
  public set names(value: string[]) {
    this._names = value;
  }

  @Input()
  public defaultNames: string[];

  @Output()
  public namesChange: EventEmitter<string[]>;

  public selectedName: FormControl;
  public pickedNames: FormControl;
  public form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.label = 'attributes';
    this._names = [];
    this.defaultNames = [];
    // form
    this.selectedName = formBuilder.control(null);
    this.pickedNames = formBuilder.control([], { nonNullable: true });
    this.form = formBuilder.group({
      selectedName: this.selectedName,
      pickedNames: this.pickedNames,
    });
    // events
    this.namesChange = new EventEmitter<string[]>();
  }

  public reset(): void {
    this.pickedNames.setValue([]);
    this.namesChange.emit(this.pickedNames.value);
  }

  public addName(): void {
    const name = this.selectedName.value;
    if (!name || this.pickedNames.value.includes(name)) {
      return;
    }
    const names = [...this.pickedNames.value];
    names.push(name);
    names.sort();
    this.pickedNames.setValue(names);
    this.namesChange.emit(this.pickedNames.value);
  }

  public removeName(name: string): void {
    const i = this.pickedNames.value.indexOf(name);
    if (i === -1) {
      return;
    }
    const names = [...this.pickedNames.value];
    names.splice(i, 1);
    this.pickedNames.setValue(names);
    this.namesChange.emit(this.pickedNames.value);
  }
}
