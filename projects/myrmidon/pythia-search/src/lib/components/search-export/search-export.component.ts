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

  @Input()
  public disabled?: boolean;

  public isExporting = false;

  constructor(
    private _searchService: SearchService,
    private _snackbar: MatSnackBar
  ) {}

  public ngOnDestroy() {
    this.cancelExport();
  }

  private downloadCsv(csvData: string) {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'search_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public exportCsv() {
    if (!this.query || this.isExporting) {
      return;
    }
    this.isExporting = true;

    this._sub = this._searchService.exportSearchResults(this.query).subscribe({
      next: (csvData: string) => {
        this.downloadCsv(csvData);
        this.isExporting = false;
        this._snackbar.open('Results exported', 'OK', { duration: 2000 });
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
    }
  }
}
