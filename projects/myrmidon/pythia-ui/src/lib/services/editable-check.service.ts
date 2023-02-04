import { Injectable } from '@angular/core';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { HasUserId } from '@myrmidon/pythia-core';

@Injectable({
  providedIn: 'root',
})
export class EditableCheckService {
  constructor(private _authService: AuthJwtService) {}

  public isEditable(target?: HasUserId | null): boolean {
    if (!target) {
      return false;
    }
    // to a user resource, it must belong to a specific user,
    // and the logged in user must be that user, or an admin
    return target.userId &&
      (target.userId === this._authService.currentUserValue?.userName ||
        this._authService.isCurrentUserInRole('admin'))
      ? true
      : false;
  }
}
