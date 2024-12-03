import { CommonModule } from '@angular/common';
import { Component, Input, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { TextMapNode } from '@myrmidon/pythia-core';
import {
  BrowserTreeNodeComponent,
  PageChangeRequest,
  PagedTreeStore,
  TreeNodeFilter,
} from '@myrmidon/paged-data-browsers';

import {
  FlatMapNode,
  MapPagedTreeStoreService,
} from '../map-paged-tree-store.service';
import { Observable } from 'rxjs';

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
    MatIconModule,
    MatProgressBarModule,
    // myrmidon
    BrowserTreeNodeComponent,
  ],
  templateUrl: './map-paged-tree-browser.component.html',
  styleUrl: './map-paged-tree-browser.component.scss',
})
export class MapPagedTreeBrowserComponent {
  private _map?: TextMapNode;
  private _store?: PagedTreeStore<FlatMapNode, TreeNodeFilter>;
  private _service?: MapPagedTreeStoreService;

  /**
   * The root node of the map to display.
   */
  @Input()
  public get map(): TextMapNode | undefined {
    return this._map;
  }
  public set map(value: TextMapNode | undefined | null) {
    if (this._map === value) {
      return;
    }
    this._map = value || undefined;
    this.updateTree();
  }

  /**
   * Whether to show debug information.
   */
  public readonly debug = input<boolean>();

  /**
   * Emits when a map node is clicked.
   */
  public readonly mapNodeClick = output<TextMapNode>();

  public nodes$?: Observable<readonly FlatMapNode[] | undefined>;
  public filter$?: Observable<TreeNodeFilter | undefined>;

  private updateTree() {
    if (this._map) {
      this._service = new MapPagedTreeStoreService(this._map);
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
      this._store.collapse(node.id).finally(() => {});
    } else {
      this._store.expand(node.id).finally(() => {});
    }
  }

  public onPageChangeRequest(request: PageChangeRequest): void {
    if (!this._store) {
      return;
    }
    this._store.changePage(request.node.id, request.paging.pageNumber);
  }

  public onFilterChange(filter: TreeNodeFilter | null | undefined): void {
    if (!this._store) {
      return;
    }
    console.log('filter change', filter);
    this._store.setFilter(filter || {});
  }

  public onMapNodeClick(node: FlatMapNode): void {
    console.log('map node click', node);
    this.mapNodeClick.emit(node.payload);
  }
}
