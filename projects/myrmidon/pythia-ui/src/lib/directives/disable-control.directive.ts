import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

// https://netbasal.com/disabling-form-controls-when-working-with-reactive-forms-in-angular-549dd7b42110

/**
 * Directive used to disable a control via binding.
 * Use like: <input [formControl]="myInput" [pythiaDisableControl]="myDisabled">
 */
@Directive({
  selector: '[pythiaDisableControl]',
})
export class DisableControlDirective {
  @Input() set disableControl(condition: boolean) {
    const action = condition ? 'disable' : 'enable';
    this.ngControl.control![action]();
  }

  constructor(private ngControl: NgControl) {}
}
