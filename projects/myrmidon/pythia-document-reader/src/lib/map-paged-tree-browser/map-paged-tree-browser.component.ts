import { CommonModule } from '@angular/common';
import { Component, effect, input, OnDestroy, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
} from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TextMapNode } from '@myrmidon/pythia-core';
import {
  BrowserTreeNodeComponent,
  PageChangeRequest,
  PagedTreeStore,
} from '@myrmidon/paged-data-browsers';

import {
  FlatMapNode,
  FlatMapNodeFilter,
  MapPagedTreeStoreService,
} from '../map-paged-tree-store.service';

/**
 * A component that displays a paged tree browser for a text map.
 */
@Component({
  selector: 'pythia-map-paged-tree-browser',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // material
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatTooltipModule,
    // myrmidon
    BrowserTreeNodeComponent,
  ],
  templateUrl: './map-paged-tree-browser.component.html',
  styleUrl: './map-paged-tree-browser.component.scss',
})
export class MapPagedTreeBrowserComponent implements OnDestroy {
  private readonly _sub?: Subscription;
  private _store?: PagedTreeStore<FlatMapNode, FlatMapNodeFilter>;
  private _service?: MapPagedTreeStoreService;

  /**
   * The root node of the map to display.
   */
  public readonly map = input.required<TextMapNode | undefined>();

  /**
   * Whether to show debug information.
   */
  public readonly debug = input<boolean>();

  /**
   * The minimum map nodes count treshold for showing the filter.
   */
  public filterTreshold = input<number>(0);

  /**
   * Whether to hide the full document button.
   */
  public readonly hideFullDocument = input<boolean>(false);

  /**
   * Emits when a map node is clicked.
   */
  public readonly mapNodeClick = output<TextMapNode>();

  public readonly labelFilter: FormControl<string | null>;
  public nodes$?: Observable<readonly FlatMapNode[] | undefined>;
  public filter$?: Observable<FlatMapNodeFilter | undefined>;

  constructor() {
    this.labelFilter = new FormControl<string | null>(null);
    this._sub = this.labelFilter.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(300))
      .subscribe((value) => {
        if (this._store) {
          this._store.setFilter({ label: value } as FlatMapNodeFilter);
        }
      });

    effect(() => {
      this.updateTree(this.map());
    });
  }

  public ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  public resetLabelFilter(): void {
    this.labelFilter.reset();
  }

  private updateTree(map: TextMapNode | undefined): void {
    if (map) {
      this._service = new MapPagedTreeStoreService(map);
      this._store = new PagedTreeStore(this._service);
      this.nodes$ = this._store.nodes$;
      this.filter$ = this._store.filter$;
      this._store.reset();
    } else {
      this._service = undefined;
      this._store = undefined;
      this.nodes$ = undefined;
      this.filter$ = undefined;
    }
  }

  public onToggleExpanded(node: FlatMapNode): void {
    if (!this._store) {
      return;
    }
    if (node.expanded) {
      this._store.collapse(node.id);
    } else {
      this._store.expand(node.id);
    }
  }

  public onPageChangeRequest(request: PageChangeRequest): void {
    if (!this._store) {
      return;
    }
    this._store.changePage(request.node.id, request.paging.pageNumber);
  }

  public onMapNodeClick(node: FlatMapNode): void {
    console.log('map node click', node);
    this.mapNodeClick.emit(node.payload);
  }

  public showFullDocument(): void {
    if (this.map()) {
      this.mapNodeClick.emit(this.map()!);
    }
  }
}
