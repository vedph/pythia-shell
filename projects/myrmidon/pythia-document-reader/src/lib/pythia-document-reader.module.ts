import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTreeModule } from '@angular/material/tree';

// myrmidon
import { NgToolsModule } from '@myrmidon/ng-tools';

import { PythiaApiModule } from '@myrmidon/pythia-api';
import { PythiaCoreModule } from '@myrmidon/pythia-core';

import { DocumentReaderComponent } from './document-reader/document-reader.component';

@NgModule({
  declarations: [
    DocumentReaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    // myrmidon
    NgToolsModule,
    // Pythia
    PythiaApiModule,
    PythiaCoreModule,
  ],
  exports: [],
})
export class PythiaDocumentReaderModule {}
