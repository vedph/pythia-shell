import { Component, Input, OnDestroy } from '@angular/core';
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
  public query: string = '';

  public isExporting = false;
  public progress = 0;

  constructor(private _searchService: SearchService) {}

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
        // Handle error (e.g., show an error message to the user)
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
      // Optionally, notify the user that the export was cancelled
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
