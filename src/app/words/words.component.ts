import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-words',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './words.component.html',
  styleUrl: './words.component.scss',
})
export class WordsComponent {
  constructor(private _router: Router) {}

  public requestSearch(term: string): void {
    this._router.navigate(['search', term]);
  }
}
