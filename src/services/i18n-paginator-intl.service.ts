import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

// https://material.angular.io/components/paginator/examples

@Injectable()
export class I18nPaginatorIntlService implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = $localize`First page`;
  itemsPerPageLabel = $localize`Items per page:`;
  lastPageLabel = $localize`Last page`;
  nextPageLabel = $localize`Next page`;
  previousPageLabel = $localize`Previous page`;

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return $localize`Page ${page + 1} of ${amountPages}`;
  }
}
