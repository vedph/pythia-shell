import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTreeModule } from '@angular/material/tree';

// myrmidon
import { NgToolsModule } from '@myrmidon/ng-tools';
import { PagedDataBrowsersModule } from '@myrmidon/paged-data-browsers';

import { PythiaApiModule } from '@myrmidon/pythia-api';
import { PythiaCoreModule } from '@myrmidon/pythia-core';

import { DocumentReaderComponent } from './document-reader/document-reader.component';

@NgModule({
  declarations: [DocumentReaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTreeModule,
    // myrmidon
    NgToolsModule,
    PagedDataBrowsersModule,
    // Pythia
    PythiaApiModule,
    PythiaCoreModule,
  ],
  exports: [DocumentReaderComponent],
})
export class PythiaDocumentReaderModule {}
