import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import '@angular/localize/init';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

import { DataPage } from '@myrmidon/ng-tools';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { PagedListStore } from '@myrmidon/paged-data-browsers';

import { Corpus } from '@myrmidon/pythia-core';
import { CorpusFilter, CorpusService } from '@myrmidon/pythia-api';

import { CorpusListBrowserService } from './corpus-list-browser.service';
import { EditedCorpus } from '../corpus-editor/corpus-editor.component';

@Component({
  selector: 'pythia-corpus-list',
  templateUrl: './corpus-list.component.html',
  styleUrls: ['./corpus-list.component.css'],
})
export class CorpusListComponent {
  private readonly _store: PagedListStore<CorpusFilter, Corpus>;
  public filter$: Observable<Readonly<CorpusFilter>>;
  public page$: Observable<Readonly<DataPage<Corpus>>>;
  public loading?: boolean;
  public editedCorpus?: EditedCorpus;

  public admin: boolean;

  constructor(
    service: CorpusListBrowserService,
    private _corpusService: CorpusService,
    private _authService: AuthJwtService,
    private _dialogService: DialogService,
    private _snackbar: MatSnackBar
  ) {
    this._store = service.store;
    this.filter$ = this._store.filter$;
    this.page$ = this._store.page$;
    this.admin = _authService.isCurrentUserInRole('admin');
  }

  public reset(): void {
    this.loading = true;
    this._store
      .applyFilter(
        this.admin
          ? {}
          : { userId: this._authService.currentUserValue?.userName }
      )
      .finally(() => {
        this.loading = false;
      });
  }

  public ngOnInit(): void {
    if (this._store.isEmpty()) {
      this.reset();
    }
  }

  public onFilterChange(filter: CorpusFilter): void {
    this.loading = true;
    if (!this.admin) {
      filter = {
        ...filter,
        userId: this._authService.currentUserValue?.userName,
      };
    }
    this._store.applyFilter(filter).finally(() => {
      this.loading = false;
    });
  }

  public onPageChange(event: PageEvent): void {
    this.loading = true;
    this._store.setPage(event.pageIndex + 1, event.pageSize).finally(() => {
      this.loading = false;
    });
  }

  public addCorpus(): void {
    if (!this._authService.currentUserValue) {
      return;
    }
    this.editedCorpus = {
      id: '',
      title: 'corpus',
      description: '',
      userId: this._authService.currentUserValue?.userName!,
    };
  }

  public editCorpus(corpus: Corpus): void {
    if (!this._authService.currentUserValue) {
      return;
    }
    this.editedCorpus = { ...corpus };
  }

  public deleteCorpus(corpus: Corpus): void {
    this._dialogService
      .confirm($localize`Confirm`, $localize`Delete corpus ${corpus.title}?`)
      .pipe(take(1))
      .subscribe((yes) => {
        if (!yes) {
          return;
        }

        this._corpusService.deleteCorpus(corpus.id).subscribe({
          next: () => {
            this.reset();
          },
          error: (err) => {
            console.error(err);
            this._snackbar.open('Error deleting corpus', 'OK');
          },
        });
      });
  }

  public onCorpusChange(corpus: EditedCorpus): void {
    this._corpusService.addCorpus(corpus, corpus.sourceId).subscribe({
      next: () => {
        this.reset();
      },
      error: (err) => {
        console.error(err);
        this._snackbar.open('Error saving corpus', 'OK');
      },
    });
    this.editedCorpus = undefined;
  }

  public onCorpusEditorClose(): void {
    this.editedCorpus = undefined;
  }
}
