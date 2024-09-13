import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

import { Lemma, Word } from '@myrmidon/pythia-api';

import { WordIndexComponent } from 'projects/myrmidon/pythia-word-index/src/public-api';

@Component({
  selector: 'app-words',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    WordIndexComponent,
  ],
  templateUrl: './words.component.html',
  styleUrl: './words.component.scss',
})
export class WordsComponent {
  constructor(private _router: Router) {}

  public onSearchRequest(token: Word | Lemma): void {
    this._router.navigate(['search', token.value]);
  }
}
