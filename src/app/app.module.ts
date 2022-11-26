import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { devTools } from '@ngneat/elf-devtools';
import { Actions } from '@ngneat/effects-ng';

// myrmidon
import { EnvServiceProvider, NgToolsModule } from '@myrmidon/ng-tools';
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';
import { AuthJwtInterceptor, AuthJwtLoginModule } from '@myrmidon/auth-jwt-login';

// libs
import { PythiaApiModule } from 'projects/myrmidon/pythia-api/src/public-api';
import { PythiaCoreModule } from 'projects/myrmidon/pythia-core/src/public-api';
import { PythiaDocumentListModule } from 'projects/myrmidon/pythia-document-list/src/public-api';
import { PythiaDocumentReaderModule } from 'projects/myrmidon/pythia-document-reader/src/public-api';
import { PythiaSearchModule } from 'projects/myrmidon/pythia-search/src/public-api';
import { PythiaStatsModule } from 'projects/myrmidon/pythia-stats/src/lib/pythia-stats.module';
import { PythiaTermListModule } from 'projects/myrmidon/pythia-term-list/src/public-api';
import { PythiaUiModule } from 'projects/myrmidon/pythia-ui/src/public-api';

// local
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { DocumentsComponent } from './documents/documents.component';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TermsComponent } from './terms/terms.component';
import { SearchComponent } from './search/search.component';

// https://ngneat.github.io/elf/docs/dev-tools/
export function initElfDevTools(actions: Actions) {
  return () => {
    devTools({
      name: 'Pthia',
      actionsDispatcher: actions,
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginPageComponent,
    DocumentsComponent,
    TermsComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgToolsModule,
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
    // Fusi
    NgToolsModule,
    NgMatToolsModule,
    AuthJwtLoginModule,
    // pythia
    PythiaApiModule,
    PythiaCoreModule,
    PythiaDocumentListModule,
    PythiaDocumentReaderModule,
    PythiaSearchModule,
    PythiaStatsModule,
    PythiaTermListModule,
    PythiaUiModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initElfDevTools,
      deps: [Actions],
    },
    EnvServiceProvider,
    // HTTP interceptor
    // https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthJwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
