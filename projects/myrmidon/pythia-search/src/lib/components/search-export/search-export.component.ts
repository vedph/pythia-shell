import { Component, Input, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchService } from '@myrmidon/pythia-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pythia-search-export',
  templateUrl: './search-export.component.html',
  styleUrl: './search-export.component.scss',
})
export class SearchExportComponent implements OnDestroy {
  private _sub?: Subscription;

  @Input()
  public query: string | null | undefined;

  public isExporting = false;
  public progress = 0;

  constructor(
    private _searchService: SearchService,
    private _snackbar: MatSnackBar
  ) {}

  public ngOnDestroy() {
    this.cancelExport();
  }

  public exportCsv() {
    if (!this.query) {
      return;
    }
    this.isExporting = true;
    this.progress = 0;

    this._sub = this._searchService.exportSearchResults(this.query).subscribe({
      next: (result) => {
        this.progress = result.progress;
        if (result.data) {
          this.downloadFile(result.data);
          this.isExporting = false;
        }
      },
      error: (error) => {
        console.error('Error exporting CSV:', error);
        this.isExporting = false;
        this._snackbar.open('Error exporting results', 'Error');
      },
      complete: () => {
        this.isExporting = false;
      },
    });
  }

  public cancelExport() {
    if (this._sub) {
      this._sub.unsubscribe();
      this._sub = undefined;
      this.isExporting = false;
      this.progress = 0;
    }
  }

  private downloadFile(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'search_results.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
