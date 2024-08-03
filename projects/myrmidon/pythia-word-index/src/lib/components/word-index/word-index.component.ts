import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Lemma, Word } from '@myrmidon/pythia-api';

import { PagedWordTreeBrowserComponent } from '../paged-word-tree-browser/paged-word-tree-browser.component';
import { TokenCountsListComponent } from '../token-counts-list/token-counts-list.component';

@Component({
  selector: 'pythia-word-index',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTooltipModule,
    PagedWordTreeBrowserComponent,
    TokenCountsListComponent,
  ],
  templateUrl: './word-index.component.html',
  styleUrl: './word-index.component.scss',
})
export class WordIndexComponent {
  public token?: Word | Lemma;

  // TODO
}
