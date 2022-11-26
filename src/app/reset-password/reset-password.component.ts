import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthJwtAccountService } from '@myrmidon/auth-jwt-admin';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  public busy: boolean | undefined;
  public form: FormGroup;
  public email: FormControl<string | null>;

  constructor(
    private _snackbar: MatSnackBar,
    private _accountService: AuthJwtAccountService,
    formBuilder: FormBuilder
  ) {
    this.email = formBuilder.control(null, [
      Validators.required,
      Validators.email,
    ]);
    this.form = formBuilder.group({
      email: this.email,
    });
  }

  public reset(): void {
    if (this.busy || !this.email.value) {
      return;
    }

    this.busy = true;
    this._accountService.resetPassword(this.email.value).subscribe({
      next: () => {
        this.busy = false;
        this._snackbar.open(`Message sent to ${this.email.value}`, 'OK');
      },
      error: (error) => {
        this.busy = false;
        console.error(error);
        this._snackbar.open(
          `Error sending message to ${this.email.value}`,
          'OK'
        );
      },
    });
  }
}
