import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { EnvServiceProvider } from '@myrmidon/ngx-tools';

import { PythiaApiModule } from '@myrmidon/pythia-api';

import { PythiaStatsComponent } from './components/pythia-stats/pythia-stats.component';

@NgModule({
  declarations: [PythiaStatsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    // pythia
    PythiaApiModule,
  ],
  exports: [PythiaStatsComponent],
  providers: [EnvServiceProvider],
})
export class PythiaStatsModule {}
