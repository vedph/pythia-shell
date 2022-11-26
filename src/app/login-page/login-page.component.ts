import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthJwtService, Credentials } from '@myrmidon/auth-jwt-login';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  constructor(private _authService: AuthJwtService, private _router: Router) {}

  ngOnInit(): void {}

  public onLoginRequest(credentials: Credentials): void {
    this._authService
      .login(credentials.name, credentials.password)
      .pipe(take(1))
      .subscribe((user) => {
        this._router.navigate([credentials.returnUrl || '/home']);
      });
  }

  public onResetRequest(): void {
    this._router.navigate(['/reset-password']);
  }
}
