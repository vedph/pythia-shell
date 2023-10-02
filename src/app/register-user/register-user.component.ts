import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserListRepository } from '@myrmidon/auth-jwt-admin';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css'],
})
export class RegisterUserComponent implements OnInit {
  constructor(
    private _router: Router,
    private _repository: UserListRepository
  ) {}

  ngOnInit(): void {}

  public onRegistered(): void {
    this._repository.reset();
    this._router.navigate(['/manage-users']);
  }
}
