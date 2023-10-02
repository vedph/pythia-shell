import { Component, Input } from '@angular/core';

import { EChartsOption } from 'echarts';

import { TermDistribution } from '@myrmidon/pythia-api';

/**
 * A single term's attribute frequencies distribution.
 */
@Component({
  selector: 'pythia-term-distribution',
  templateUrl: './term-distribution.component.html',
  styleUrls: ['./term-distribution.component.css'],
})
export class TermDistributionComponent {
  private _distribution: TermDistribution | undefined;

  public frequencies: { name: string; value: number }[];
  public chartOptions: EChartsOption | null;

  @Input()
  public get distribution(): TermDistribution | undefined {
    return this._distribution;
  }
  public set distribution(value: TermDistribution | undefined) {
    if (this._distribution !== value) {
      this._distribution = value;
      this.refresh();
    }
  }

  constructor() {
    this.frequencies = [];
    this.chartOptions = null;
  }

  private refresh(): void {
    // data
    this.frequencies = this._distribution
      ? Object.getOwnPropertyNames(this._distribution.frequencies).map((p) => {
          return {
            name: p,
            value: this._distribution!.frequencies[p],
          };
        })
      : [];

    // chart
    // https://www.npmjs.com/package/ngx-echarts
    this.chartOptions = {
      series: [
        {
          name: this._distribution?.attribute,
          data: this.frequencies,
          type: 'pie',
        },
      ],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
    };
  }
}
