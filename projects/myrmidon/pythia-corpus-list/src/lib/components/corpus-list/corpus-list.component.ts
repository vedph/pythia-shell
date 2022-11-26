import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Corpus } from '@myrmidon/pythia-core';

import { PaginationData } from '@ngneat/elf-pagination';
import { DialogService } from '@myrmidon/ng-mat-tools';

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

  constructor(
    private _repository: CorpusListRepository,
    private _dialogService: DialogService
  ) {
    this.pagination$ = _repository.pagination$;
    this.loading$ = _repository.loading$;
    this.saving$ = _repository.saving$;
  }

  public pageChange(event: PageEvent): void {
    this._repository.loadPage(event.pageIndex + 1, event.pageSize);
  }

  public clearCache(): void {
    this._repository.clearCache();
    this._repository.loadPage(1);
  }

  public editCorpus(corpus: Corpus): void {
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
      });
  }

  public onCorpusChange(corpus: EditedCorpus): void {
    this._repository.addCorpus(corpus, corpus.sourceId);
  }

  public onCorpusEditorClose(): void {
    this.editedCorpus = undefined;
  }
}
