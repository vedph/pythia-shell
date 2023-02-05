import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Corpus } from '@myrmidon/pythia-core';

import { PaginationData } from '@ngneat/elf-pagination';
import { DialogService } from '@myrmidon/ng-mat-tools';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { CorpusFilter } from '@myrmidon/pythia-api';

import { EditedCorpus } from '../corpus-editor/corpus-editor.component';
import { CorpusListRepository } from '../../corpus-list.repository';

@Component({
  selector: 'pythia-corpus-list',
  templateUrl: './corpus-list.component.html',
  styleUrls: ['./corpus-list.component.css'],
})
export class CorpusListComponent {
  public pagination$: Observable<PaginationData & { data: Corpus[] }>;
  public editedCorpus?: EditedCorpus;

  public loading$: Observable<boolean>;
  public saving$: Observable<boolean>;
  public showUserId: boolean;

  constructor(
    private _repository: CorpusListRepository,
    private _authService: AuthJwtService,
    private _dialogService: DialogService
  ) {
    this.pagination$ = _repository.pagination$;
    this.loading$ = _repository.loading$;
    this.saving$ = _repository.saving$;
    this.showUserId = _authService.isCurrentUserInRole('admin');

    // show only current user's corpora except when he's admin
    this._repository.setFilter({
      userId: _authService.isCurrentUserInRole('admin')
        ? undefined
        : _authService.currentUserValue?.userName,
    } as CorpusFilter);
  }

  public pageChange(event: PageEvent): void {
    this._repository.loadPage(event.pageIndex + 1, event.pageSize);
  }

  public clearCache(): void {
    this._repository.clearCache();
    this._repository.loadPage(1);
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
      .confirm('Confirm', `Delete corpus ${corpus.title}?`)
      .pipe(take(1))
      .subscribe((yes) => {
        if (!yes) {
          return;
        }
        this._repository.deleteCorpus(corpus.id);
        this.editedCorpus = undefined;
      });
  }

  public onCorpusChange(corpus: EditedCorpus): void {
    this._repository.addCorpus(corpus, corpus.sourceId);
    this.editedCorpus = undefined;
  }

  public onCorpusEditorClose(): void {
    this.editedCorpus = undefined;
  }
}
