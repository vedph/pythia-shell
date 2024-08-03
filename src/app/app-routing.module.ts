import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthJwtAdminGuardService,
  AuthJwtGuardService,
} from '@myrmidon/auth-jwt-login';

import { CorporaComponent } from './corpora/corpora.component';
import { DocumentsComponent } from './documents/documents.component';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SearchComponent } from './search/search.component';
import { WordsComponent } from './words/words.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [AuthJwtGuardService],
  },
  {
    path: 'register-user',
    component: RegisterUserComponent,
    canActivate: [AuthJwtAdminGuardService],
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [AuthJwtAdminGuardService],
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [AuthJwtGuardService],
  },
  {
    path: 'corpora',
    component: CorporaComponent,
    canActivate: [AuthJwtGuardService],
  },
  {
    path: 'words',
    component: WordsComponent,
    canActivate: [AuthJwtGuardService],
  },
  {
    path: 'search/:term',
    component: SearchComponent,
    canActivate: [AuthJwtGuardService],
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthJwtGuardService],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
