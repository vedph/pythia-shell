import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// material
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

import { NgxEchartsModule } from 'ngx-echarts';

import { NgToolsModule } from '@myrmidon/ng-tools';

import { RefLookupComponent } from '@myrmidon/cadmus-refs-lookup';
import { PythiaApiModule } from '@myrmidon/pythia-api';
import { PythiaCoreModule } from '@myrmidon/pythia-core';
import { PythiaUiModule } from '@myrmidon/pythia-ui';

import { TermFilterComponent } from './components/term-filter/term-filter.component';
import { TermListComponent } from './components/term-list/term-list.component';
import { AttributePickerComponent } from './components/attribute-picker/attribute-picker.component';
import { TermDistributionComponent } from './components/term-distribution/term-distribution.component';
import { TermDistributionSetComponent } from './components/term-distribution-set/term-distribution-set.component';

@NgModule({
  declarations: [
    AttributePickerComponent,
    TermDistributionComponent,
    TermDistributionSetComponent,
    TermFilterComponent,
    TermListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
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
    // vendor
    NgxEchartsModule,
    // myrmidon
    NgToolsModule,
    RefLookupComponent,
    // Pythia
    PythiaApiModule,
    PythiaCoreModule,
    PythiaUiModule,
  ],
  exports: [
    AttributePickerComponent,
    TermDistributionComponent,
    TermDistributionSetComponent,
    TermFilterComponent,
    TermListComponent,
  ],
})
export class PythiaTermListModule {}
