import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

// vendors
import { NgxEchartsModule } from 'ngx-echarts';

// myrmidon
import {
  EllipsisPipe,
  EnvServiceProvider,
  FlatLookupPipe,
  SafeHtmlPipe,
} from '@myrmidon/ngx-tools';
import {
  AuthJwtInterceptor,
  AuthJwtLoginComponent,
  GravatarPipe,
} from '@myrmidon/auth-jwt-login';
import {
  AuthJwtRegistrationComponent,
  UserListComponent,
} from '@myrmidon/auth-jwt-admin';
import { PagedWordTreeBrowserComponent } from '@myrmidon/pythia-word-index';

// libs
import { PythiaApiModule } from 'projects/myrmidon/pythia-api/src/public-api';
import { PythiaCoreModule } from 'projects/myrmidon/pythia-core/src/public-api';
import { PythiaCorpusListModule } from 'projects/myrmidon/pythia-corpus-list/src/public-api';
import { PythiaDocumentListModule } from 'projects/myrmidon/pythia-document-list/src/public-api';
import { PythiaDocumentReaderModule } from 'projects/myrmidon/pythia-document-reader/src/public-api';
import {
  PythiaQueryBuilderModule,
  QUERY_BUILDER_ATTR_DEFS_KEY,
} from 'projects/myrmidon/pythia-query-builder/src/public-api';
import { PythiaSearchModule } from 'projects/myrmidon/pythia-search/src/public-api';
import { PythiaStatsModule } from 'projects/myrmidon/pythia-stats/src/lib/pythia-stats.module';
import { PythiaUiModule } from 'projects/myrmidon/pythia-ui/src/public-api';

// local
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DocumentsComponent } from './documents/documents.component';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SearchComponent } from './search/search.component';
import { CorporaComponent } from './corpora/corpora.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ATTR_DEFS } from './attr-defs';
import { I18nPaginatorIntlService } from '../services/i18n-paginator-intl.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginPageComponent,
    ManageUsersComponent,
    RegisterUserComponent,
    ResetPasswordComponent,
    DocumentsComponent,
    SearchComponent,
    CorporaComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    // material
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
    MatTreeModule,
    // vendor
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    // myrmex
    EllipsisPipe,
    FlatLookupPipe,
    SafeHtmlPipe,
    AuthJwtLoginComponent,
    AuthJwtRegistrationComponent,
    UserListComponent,
    GravatarPipe,
    PagedWordTreeBrowserComponent,
    // pythia
    PythiaApiModule,
    PythiaCoreModule,
    PythiaCorpusListModule,
    PythiaDocumentListModule,
    PythiaDocumentReaderModule,
    PythiaQueryBuilderModule,
    PythiaSearchModule,
    PythiaStatsModule,
    PythiaUiModule,
  ],
  providers: [
    EnvServiceProvider,
    // HTTP interceptor
    // https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthJwtInterceptor,
      multi: true,
    },
    // query builder
    {
      provide: QUERY_BUILDER_ATTR_DEFS_KEY,
      useValue: ATTR_DEFS,
    },
    // paginator i18n
    {
      provide: MatPaginatorIntl,
      useClass: I18nPaginatorIntlService,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
