import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  PageChangeRequest,
  PagedDataBrowsersModule,
  PagedTreeStore,
} from '@myrmidon/paged-data-browsers';
import { WordFilter } from '@myrmidon/pythia-api';

import { PagedWordTreeNode } from '../../services/paged-word-tree-store.service';
import { PagedWordTreeBrowserService } from '../../services/paged-word-tree-browser.service';
import { PagedWordTreeFilterComponent } from '../paged-word-tree-filter/paged-word-tree-filter.component';

@Component({
  selector: 'pythia-paged-word-tree-browser',
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
    PagedDataBrowsersModule,
    PagedWordTreeFilterComponent,
  ],
  templateUrl: './paged-word-tree-browser.component.html',
  styleUrl: './paged-word-tree-browser.component.scss',
})
export class PagedWordTreeBrowserComponent implements OnInit {
  private readonly _store: PagedTreeStore<PagedWordTreeNode, WordFilter>;

  public loading?: boolean;
  public filter$: Observable<Readonly<WordFilter>>;
  public nodes$: Observable<Readonly<PagedWordTreeNode[]>>;

  constructor(
    service: PagedWordTreeBrowserService,
    private _dialog: MatDialog
  ) {
    this._store = service.store;
    this.nodes$ = this._store.nodes$;
    this.filter$ = this._store.filter$;
  }

  public ngOnInit(): void {
    if (!this._store.getNodes().length) {
      this.loading = true;
      this._store.setFilter({}).finally(() => {
        this.loading = false;
      });
    }
  }

  public reset(): void {
    this.loading = true;
    this._store.reset().finally(() => {
      this.loading = false;
    });
  }

  public onToggleExpanded(node: PagedWordTreeNode): void {
    this.loading = true;
    if (node.expanded) {
      this._store.collapse(node.id).finally(() => {
        this.loading = false;
      });
    } else {
      this._store.expand(node.id).finally(() => {
        this.loading = false;
      });
    }
  }

  public onPageChangeRequest(request: PageChangeRequest): void {
    this.loading = true;
    this._store
      .changePage(request.node.id, request.paging.pageNumber)
      .finally(() => {
        this.loading = false;
      });
  }

  public onFilterChange(filter: WordFilter): void {
    this.loading = true;
    this._store.setFilter(filter).finally(() => {
      this.loading = false;
    });
  }

  public onEditFilterRequest(node: PagedWordTreeNode): void {
    const dialogRef = this._dialog.open(PagedWordTreeFilterComponent, {
      data: {
        filter: node.filter,
      },
    });
    dialogRef.afterClosed().subscribe((filter) => {
      // undefined = user dismissed without changes
      if (filter === null) {
        this._store.setNodeFilter(node.id, null);
      } else if (filter) {
        this._store.setNodeFilter(node.id, filter);
      }
    });
  }
}
