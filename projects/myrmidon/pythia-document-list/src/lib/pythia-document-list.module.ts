import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
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

import { NgToolsModule } from '@myrmidon/ng-tools';
import { PagedDataBrowsersModule } from '@myrmidon/paged-data-browsers';

import { PythiaApiModule } from '@myrmidon/pythia-api';
import { PythiaCoreModule } from '@myrmidon/pythia-core';
import { PythiaUiModule } from '@myrmidon/pythia-ui';

import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentFilterComponent } from './document-filter/document-filter.component';
import { DocumentRepository } from './document.repository';
import { DocumentCorpusComponent } from './document-corpus/document-corpus.component';
import { DocumentInfoComponent } from './document-info/document-info.component';
import { RefLookupComponent } from '@myrmidon/cadmus-refs-lookup';

@NgModule({
  declarations: [
    DocumentListComponent,
    DocumentFilterComponent,
    DocumentCorpusComponent,
    DocumentInfoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatToolbarModule,
    // Fusi
    NgToolsModule,
    PagedDataBrowsersModule,
    RefLookupComponent,
    // Pythia
    PythiaCoreModule,
    PythiaApiModule,
    PythiaUiModule,
  ],
  exports: [
    DocumentListComponent,
    DocumentFilterComponent,
    DocumentCorpusComponent,
    DocumentInfoComponent,
  ],
  providers: [DocumentRepository],
})
export class PythiaDocumentListModule {}
