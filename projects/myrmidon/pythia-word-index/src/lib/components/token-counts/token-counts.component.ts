import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AttributeInfo, Lemma, Word, WordService } from '@myrmidon/pythia-api';

@Component({
  selector: 'pythia-token-counts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './token-counts.component.html',
  styleUrl: './token-counts.component.scss',
})
export class TokenCountsComponent implements OnInit {
  private _token?: Word | Lemma;

  @Input()
  public get token(): Word | Lemma | undefined {
    return this._token;
  }
  public set token(value: Word | Lemma | undefined) {
    if (value === this._token) {
      return;
    }
    this._token = value;
    // TODO
  }

  @Input()
  public maxCounts = 5;

  public attributes?: AttributeInfo[];

  constructor(private _wordService: WordService) {}

  public ngOnInit(): void {
    if (!this.attributes) {
      this._wordService
        .getDocAttributeInfo()
        .pipe(take(1))
        .subscribe((attributes) => {
          this.attributes = attributes;
        });
    }
  }
}
