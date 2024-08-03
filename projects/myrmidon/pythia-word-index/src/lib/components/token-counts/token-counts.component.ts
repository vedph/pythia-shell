import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

import { AttributeInfo, TokenCount } from '@myrmidon/pythia-api';

import { PercentagePipe } from '../../pipes/percentage.pipe';

@Component({
  selector: 'pythia-token-counts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    NgxEchartsModule,
    PercentagePipe
  ],
  templateUrl: './token-counts.component.html',
  styleUrl: './token-counts.component.scss',
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

  public copy(): void {
    // TODO
  }

  public save(): void {
    // TODO
  }
}
