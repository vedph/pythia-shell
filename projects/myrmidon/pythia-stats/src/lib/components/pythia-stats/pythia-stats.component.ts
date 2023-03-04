import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LocalStorageService } from '@myrmidon/ng-tools';
import { StatsService } from '@myrmidon/pythia-api';

import { take } from 'rxjs/operators';

interface StatEntry {
  name: string;
  value: number;
}

@Component({
  selector: 'pythia-stats',
  templateUrl: './pythia-stats.component.html',
  styleUrls: ['./pythia-stats.component.css'],
})
export class PythiaStatsComponent implements OnInit {
  public loading: boolean | undefined;
  public entries: StatEntry[];

  constructor(
    private _snackbar: MatSnackBar,
    private _statsService: StatsService,
    private _localStorage: LocalStorageService
  ) {
    this.entries = [];
  }

  ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    const entries: StatEntry[] | null =
      this._localStorage.retrieve<StatEntry[]>('pythia-stats');
    if (entries) {
      this.entries = entries;
      return;
    }

    this.loading = true;
    this._statsService
      .getStatistics()
      .pipe(take(1))
      .subscribe({
        next: (stats) => {
          this.loading = false;
          this.entries = Object.keys(stats)
            .sort()
            .map((k) => {
              return {
                name: k,
                value: stats[k],
              };
            });
          this._localStorage.store('pythia-stats', this.entries);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error getting stats');
          if (error) {
            console.error(JSON.stringify(error));
          }
          this._snackbar.open('Error getting stats', 'OK');
        },
      });
  }
}
