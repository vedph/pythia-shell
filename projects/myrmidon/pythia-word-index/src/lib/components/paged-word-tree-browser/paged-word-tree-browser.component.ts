import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  BrowserTreeNodeComponent,
  PageChangeRequest,
  PagedTreeStore,
} from '@myrmidon/paged-data-browsers';
import { Lemma, Word, WordFilter } from '@myrmidon/pythia-api';

import { PagedWordTreeNode } from '../../services/paged-word-tree-store.service';
import { PagedWordTreeBrowserService } from '../../services/paged-word-tree-browser.service';
import {
  PagedWordTreeFilterComponent,
  WordTreeFilterSortOrderEntry,
} from '../paged-word-tree-filter/paged-word-tree-filter.component';

@Component({
  selector: 'pythia-paged-word-tree-browser',
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
    BrowserTreeNodeComponent,
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

  /**
   * Whether to hide the language filter.
   */
  @Input()
  public hideLanguage?: boolean;

  /**
   * Whether to hide the node y,x location.
   */
  @Input()
  public hideLoc?: boolean;

  /**
   * Whether to hide the node filter.
   */
  @Input()
  public hideFilter?: boolean;

  /**
   * Whether to enable debug node view.
   */
  @Input()
  public debug?: boolean;

  /**
   * The sort order entries to display in the sort order dropdown.
   * If not set, the sort order dropdown will use the default entries.
   */
  @Input()
  public sortOrderEntries?: WordTreeFilterSortOrderEntry[];

  @Output()
  public readonly searchRequest = new EventEmitter<Word | Lemma>();
  @Output()
  public readonly countsRequest = new EventEmitter<Word | Lemma>();

  constructor(
    service: PagedWordTreeBrowserService,
    private _dialog: MatDialog
  ) {
    this._store = service.store;
    this.nodes$ = this._store.nodes$;
    this.filter$ = this._store.filter$;
  }

  public trackNode(index: number, node: PagedWordTreeNode): string {
    const key = `${node.y}_${node.id}`;
    return key;
  }

  public ngOnInit(): void {
    if (!this._store.getNodes().length) {
      this.loading = true;
      this._store.setFilter({}).finally(() => {
        this.loading = false;
        this._store.expand(this._store.getRootNode()!.id);
      });
    }
  }

  public reset(): void {
    this.loading = true;
    this._store.reset().finally(() => {
      this.loading = false;
      this._store.expand(this._store.getRootNode()!.id);
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
      const root = this._store.getRootNode();
      if (root && !root.expanded) {
        this._store.expand(root.id);
      }
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

  public requestSearch(term: Word | Lemma): void {
    if (term.id < 0) {
      term.id = Math.abs(term.id);
    }
    this.searchRequest.emit(term);
  }

  public requestCounts(term: Word | Lemma): void {
    if (term.id < 0) {
      term.id = Math.abs(term.id);
    }
    this.countsRequest.emit(term);
  }
}
