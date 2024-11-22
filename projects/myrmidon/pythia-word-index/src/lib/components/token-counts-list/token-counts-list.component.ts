import { Component, Input } from '@angular/core';
import { take } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  Word,
  Lemma,
  AttributeInfo,
  WordService,
  TokenCount,
} from '@myrmidon/pythia-api';

import { TokenCountsComponent } from '../token-counts/token-counts.component';

/**
 * A component to display a list of counts for a specific token and
 * a set of document attributes.
 */
@Component({
    selector: 'pythia-token-counts-list',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        MatSelectModule,
        MatTooltipModule,
        TokenCountsComponent,
    ],
    templateUrl: './token-counts-list.component.html',
    styleUrl: './token-counts-list.component.scss'
})
export class TokenCountsListComponent {
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
    this.loadCounts();
  }

  @Input()
  public maxCounts = 5;

  @Input()
  public noToolbar?: boolean;

  @Input()
  public attributes?: AttributeInfo[];

  public busy?: boolean;
  public readonly selectedAttributes: FormControl<AttributeInfo[]>;
  public counts: { [key: string]: TokenCount[] } = {};

  constructor(formBuilder: FormBuilder, private _wordService: WordService) {
    this.selectedAttributes = formBuilder.control<AttributeInfo[]>([], {
      nonNullable: true,
    });
  }

  public ngOnInit(): void {
    // on first load, get the list of available attributes if not provided
    if (!this.attributes) {
      this._wordService
        .getDocAttributeInfo()
        .pipe(take(1))
        .subscribe((attributes) => {
          this.selectedAttributes.reset();
          this.attributes = attributes;
        });
    }
  }

  public loadCounts(): void {
    if (this.busy || !this.token) {
      return;
    }

    if (!this.selectedAttributes.value?.length) {
      this.counts = {};
      return;
    }

    this.busy = true;

    if (this.token!.type === 'lemma') {
      this._wordService
        .getLemmaCounts(
          this.token!.id,
          this.selectedAttributes.value.map((i) => i.name)
        )
        .pipe(take(1))
        .subscribe({
          next: (map) => {
            this.counts = map;
          },
          complete: () => {
            this.busy = false;
          },
        });
    } else {
      this._wordService
        .getWordCounts(
          this.token!.id,
          this.selectedAttributes.value.map((i) => i.name)
        )
        .pipe(take(1))
        .subscribe({
          next: (map) => {
            this.counts = map;
          },
          complete: () => {
            this.busy = false;
          },
        });
    }
  }
}
