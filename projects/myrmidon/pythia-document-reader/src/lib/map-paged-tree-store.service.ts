import { DataPage } from '@myrmidon/ngx-tools';
import {
  PagedTreeNode,
  PagedTreeStoreService,
  TreeNode,
  TreeNodeFilter,
} from '@myrmidon/paged-data-browsers';
import { TextMapNode } from '@myrmidon/pythia-core';

import { Observable, of } from 'rxjs';

/**
 * A flat map node. This derives from flattening a TextMapNode for use
 * in a paged tree browser.
 */
export interface FlatMapNode extends PagedTreeNode<FlatMapNodeFilter> {
  payload: TextMapNode;
}

/**
 * A filter for flat map nodes.
 */
export interface FlatMapNodeFilter extends TreeNodeFilter {
  label?: string;
}

/**
 * A service that provides a paged tree of flat map nodes.
 */
export class MapPagedTreeStoreService
  implements PagedTreeStoreService<FlatMapNodeFilter>
{
  private readonly _map: TextMapNode;
  private _nodes: PagedTreeNode<FlatMapNodeFilter>[] = [];

  constructor(map: TextMapNode) {
    this._map = map;
    this.loadMap();
  }

  private loadMap(): void {
    // flatten map into _nodes
    this._nodes.length = 0;
    this.flattenMap(this._map, null);
  }

  private getNodeDepth(node: TextMapNode): number {
    let depth = 0;
    let current: TextMapNode | undefined = node;
    while (current) {
      depth++;
      current = current.parent;
    }
    return depth;
  }

  private flattenMap(node: TextMapNode, parent: FlatMapNode | null): void {
    const flatNode: FlatMapNode = {
      id: node.start,
      parentId: parent?.id,
      y: this.getNodeDepth(node),
      x: node.parent
        ? node.parent.children!.indexOf(node) + 1
        : this._nodes.filter((n) => n.parentId === undefined).length,
      label: node.label,
      payload: node,
      hasChildren: !!node.children,
      expanded: false,
      paging: {
        pageNumber: 0,
        pageCount: 0,
        total: 0,
      },
    };

    this._nodes.push(flatNode);

    if (node.children) {
      for (const child of node.children) {
        this.flattenMap(child, flatNode);
      }
    }
  }

  /**
   * Get the specified page of nodes.
   *
   * @param filter The filter.
   * @param pageNumber The page number.
   * @param pageSize The page size.
   * @param hasMockRoot Not used because text maps always have a root.
   * @returns Nodes.
   */
  public getNodes(
    filter: FlatMapNodeFilter,
    pageNumber: number,
    pageSize: number,
    hasMockRoot?: boolean
  ): Observable<DataPage<TreeNode>> {
    const nodes = this._nodes.filter((n) => {
      if (filter.parentId !== undefined && filter.parentId !== null) {
        if (n.parentId !== filter.parentId) {
          return false;
        }
      } else {
        if (n.parentId) {
          return false;
        }
      }
      if (filter.label && n.parentId && !n.label.includes(filter.label)) {
        return false;
      }
      return true;
    });

    // page and return
    const paged = nodes.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    return of({
      items: paged,
      pageNumber: pageNumber,
      pageSize: pageSize,
      pageCount: Math.ceil(nodes.length / pageSize),
      total: nodes.length,
    });
  }
}
