import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthJwtService, User } from '@myrmidon/auth-jwt-login';
import { EnvService } from '@myrmidon/ng-tools';
import { AppSettingsService } from '@myrmidon/pythia-core';
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
    settings: AppSettingsService,
    env: EnvService
  ) {
    this.user$ = _authService.currentUser$;
    this.version = env.get('version') || '';
    // TODO customize settings here like in this sample:
    settings.termDistrDocNames = ['materia', 'giudicante', 'nascita-avv'];
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
