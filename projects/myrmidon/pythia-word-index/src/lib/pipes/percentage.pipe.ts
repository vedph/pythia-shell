import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format a number as a percentage.
 * Use like: {{ value | percentage:total:fractionDigits }}
 * @param value The value to format as a percentage.
 * @param total The total value to calculate the percentage from.
 * @param fractionDigits The number of digits after the decimal point.
 * If not specified, defaults to 2.
 */
@Pipe({
  name: 'percentage',
  standalone: true,
})
export class PercentagePipe implements PipeTransform {
  transform(value: number, total: number, fractionDigits = 2): string {
    if (!total) {
      return '0%';
    }
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(fractionDigits || 0)}%`;
  }
}
