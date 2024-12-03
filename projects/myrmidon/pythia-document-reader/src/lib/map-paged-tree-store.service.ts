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
export interface FlatMapNode extends PagedTreeNode<TreeNodeFilter> {
  payload: TextMapNode;
}

/**
 * A service that provides a paged tree of flat map nodes.
 */
export class MapPagedTreeStoreService
  implements PagedTreeStoreService<TreeNodeFilter>
{
  private readonly _map: TextMapNode;
  private _nodes: PagedTreeNode<TreeNodeFilter>[] = [];

  constructor(map: TextMapNode) {
    this._map = map;
    this.loadMap();
  }

  private loadMap(): void {
    // flatten map into _nodes
    this._nodes.length = 0;
    this.flattenMap(this._map, null);
  }

  private flattenMap(map: TextMapNode, parent: FlatMapNode | null): void {
    const node: FlatMapNode = {
      id: map.start,
      parentId: parent ? parent.id : undefined,
      y: map.location.split('.').length,
      x: map.start,
      label: map.label,
      payload: map,
      hasChildren: !!map.children,
      expanded: false,
      paging: {
        pageNumber: 0,
        pageCount: 0,
        total: 0,
      },
    };

    this._nodes.push(node);

    if (map.children) {
      for (const child of map.children) {
        this.flattenMap(child, node);
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
    filter: TreeNodeFilter,
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
      // if (filter.label && !n.label.includes(filter.label)) {
      //   return false;
      // }
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

  public fetchChildren(
    node: PagedTreeNode<TreeNodeFilter>
  ): Promise<PagedTreeNode<TreeNodeFilter>[]> {
    const children = this._nodes.filter((n) => n.parentId === node.id);
    return Promise.resolve(children);
  }
}
