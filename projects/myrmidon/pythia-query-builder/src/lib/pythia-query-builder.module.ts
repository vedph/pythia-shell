import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CadmusRefsLookupModule } from '@myrmidon/cadmus-refs-lookup';

import { NgToolsModule } from '@myrmidon/ng-tools';
import { PythiaApiModule } from '@myrmidon/pythia-api';
import { PythiaCoreModule } from '@myrmidon/pythia-core';
import { PythiaDocumentReaderModule } from '@myrmidon/pythia-document-reader';
import { PythiaUiModule } from '@myrmidon/pythia-ui';

import { CorpusSetComponent } from './components/corpus-set/corpus-set.component';
import { QueryEntryComponent } from './components/query-entry/query-entry.component';
import { QueryBuilderComponent } from './components/query-builder/query-builder.component';
import { QueryEntrySetComponent } from './components/query-entry-set/query-entry-set.component';
import { QueryOpArgsComponent } from './components/query-op-args/query-op-args.component';

@NgModule({
  declarations: [
    CorpusSetComponent,
    QueryBuilderComponent,
    QueryEntryComponent,
    QueryEntrySetComponent,
    QueryOpArgsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTooltipModule,
    // Cadmus
    CadmusRefsLookupModule,
    // Pythia
    PythiaApiModule,
    PythiaCoreModule,
    PythiaDocumentReaderModule,
    PythiaUiModule,
    NgToolsModule,
  ],
  exports: [
    CorpusSetComponent,
    QueryBuilderComponent,
    QueryEntryComponent,
    QueryEntrySetComponent,
    QueryOpArgsComponent
  ],
})
export class PythiaQueryBuilderModule {}
