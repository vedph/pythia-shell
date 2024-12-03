import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthJwtService, Credentials } from '@myrmidon/auth-jwt-login';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: false,
})
export class LoginPageComponent {
  public busy = false;
  public error?: string;

  constructor(
    private _authService: AuthJwtService,
    private _router: Router,
    private _snackbar: MatSnackBar
  ) {}

  public onLoginRequest(credentials: Credentials): void {
    this.busy = true;

    this._authService.login(credentials.name, credentials.password).subscribe({
      next: (user) => {
        console.log('User logged in', user);
        this._router.navigate([credentials.returnUrl || '/home']);
      },
      error: (error) => {
        this.error = 'Login failed';
        console.error(this.error, error);
        this._snackbar.open(this.error, 'Dismiss', {
          duration: 5000,
        });
      },
      complete: () => {
        this.busy = false;
      },
    });
  }
  public onResetRequest(): void {
    this._router.navigate(['/reset-password']);
  }
}
