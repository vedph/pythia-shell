import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { Clipboard } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

import { AttributeInfo, TokenCount } from '@myrmidon/pythia-api';

import { PercentagePipe } from '../../pipes/percentage.pipe';

/**
 * A component to display the counts for a specific token in a pie chart.
 */
@Component({
    selector: 'pythia-token-counts',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatExpansionModule,
        MatIconModule,
        MatSelectModule,
        MatTooltipModule,
        NgxEchartsModule,
        PercentagePipe,
    ],
    templateUrl: './token-counts.component.html',
    styleUrl: './token-counts.component.scss'
})
export class TokenCountsComponent {
  private _counts: TokenCount[] = [];

  @Input()
  public attribute?: AttributeInfo;

  @Input()
  public get counts(): TokenCount[] {
    return this._counts;
  }
  public set counts(value: TokenCount[]) {
    if (this._counts === value) {
      return;
    }
    this._counts = value;
    this.updateChart();
  }

  @Input()
  public noToolbar?: boolean;

  public chartOptions: EChartsOption | null = null;
  public total = 0;
  public downloading?: boolean;

  constructor(private _clipboard: Clipboard, private _snackbar: MatSnackBar) {}

  private updateChart() {
    // calculate total count
    this.total = this._counts.reduce((acc, c) => acc + c.value, 0);

    // create pie chart from counts
    // https://www.npmjs.com/package/ngx-echarts
    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: this._counts.map((c) => c.attributeValue),
      },
      series: [
        {
          name: 'count',
          type: 'pie',
          radius: '50%',
          center: ['50%', '60%'],
          data: this._counts.map((c) => ({
            name: c.attributeValue,
            value: c.value,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  private getCSV(): string {
    // get a CSV representation of the counts
    let csv = 'attr_name,attr_value,nr,percent\n';
    for (const count of this._counts) {
      csv += `${this.attribute?.name},${count.attributeValue},${count.value},${
        count.value / this.total
      }\n`;
    }
    return csv;
  }

  public copy(): void {
    if (!this._counts.length) {
      return;
    }

    const csv = this.getCSV();
    this._clipboard.copy(csv);
    this._snackbar.open($localize`Copied to clipboard`, undefined, {
      duration: 2000,
    });
  }

  public download(): void {
    if (this.downloading || !this._counts.length) {
      return;
    }
    this.downloading = true;

    let csv = this.getCSV();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const element = document.createElement('a');
    const file = new Blob([csv], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `${year}${month}${day}_${hours}${minutes}${seconds}.csv`;

    document.body.appendChild(element);
    element.click();

    this.downloading = false;
  }
}
