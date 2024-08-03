import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

import { PagedWordTreeBrowserComponent } from 'projects/myrmidon/pythia-word-index/src/public-api';

@Component({
  selector: 'app-words',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    PagedWordTreeBrowserComponent,
  ],
  templateUrl: './words.component.html',
  styleUrl: './words.component.scss',
})
export class WordsComponent {
  constructor(private _router: Router) {}

  public requestSearch(term: string): void {
    this._router.navigate(['search', term]);
  }
}
