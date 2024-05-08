import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
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

// myrmidon
import { NgMatToolsModule } from '@myrmidon/ng-mat-tools';
import { EnvServiceProvider, NgToolsModule } from '@myrmidon/ng-tools';
import { RefLookupComponent } from '@myrmidon/cadmus-refs-lookup';

// pythia
import { PythiaApiModule } from '@myrmidon/pythia-api';
import { PythiaCoreModule } from '@myrmidon/pythia-core';
import { PythiaUiModule } from '@myrmidon/pythia-ui';

// locals
import { CorpusFilterComponent } from './components/corpus-filter/corpus-filter.component';
import { CorpusListComponent } from './components/corpus-list/corpus-list.component';
import { CorpusEditorComponent } from './components/corpus-editor/corpus-editor.component';

@NgModule({
  declarations: [
    CorpusFilterComponent,
    CorpusListComponent,
    CorpusEditorComponent,
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
    // myrmidon
    NgToolsModule,
    NgMatToolsModule,
    RefLookupComponent,
    // Pythia
    PythiaApiModule,
    PythiaCoreModule,
    PythiaUiModule,
    NgToolsModule,
  ],
  exports: [CorpusFilterComponent, CorpusListComponent, CorpusEditorComponent],
  providers: [EnvServiceProvider],
})
export class PythiaCorpusListModule {}
