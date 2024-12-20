import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PythiaApiModule } from '@myrmidon/pythia-api';
import { PythiaCoreModule } from '@myrmidon/pythia-core';
import { DocumentReaderComponent } from '@myrmidon/pythia-document-reader';
import { PythiaQueryBuilderModule } from '@myrmidon/pythia-query-builder';
import { PythiaUiModule } from '@myrmidon/pythia-ui';

import { SearchComponent } from './components/search/search.component';
import { SearchExportComponent } from './components/search-export/search-export.component';

@NgModule({
  declarations: [SearchComponent, SearchExportComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    // Pythia
    PythiaApiModule,
    PythiaCoreModule,
    DocumentReaderComponent,
    PythiaQueryBuilderModule,
    PythiaUiModule,
  ],
  exports: [SearchComponent, SearchExportComponent],
})
export class PythiaSearchModule {}
