import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthJwtService,
  GravatarService,
  User,
} from '@myrmidon/auth-jwt-login';
import { EnvService } from '@myrmidon/ng-tools';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public user$: Observable<User | null>;
  public version: string;

  constructor(
    private _router: Router,
    private _authService: AuthJwtService,
    private _gravatarService: GravatarService,
    env: EnvService
  ) {
    this.user$ = _authService.currentUser$;
    this.version = env.get('version') || '';
  }

  public getGravatarUrl(email: string, size = 80): string | null {
    return this._gravatarService.buildGravatarUrl(email, size);
  }

  public logout(): void {
    this._authService
      .logout()
      .pipe(take(1))
      .subscribe((_) => {
        this._router.navigate(['/home']);
      });
  }
}
