import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maximizeTo' })
export class MaximizePipe implements PipeTransform {
  transform(value: number, maximumValue: number, suffix = '+'): any {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return value;
    }

    if (value <= maximumValue) {
      return String(value);
    }

    return maximumValue + suffix;
  }
}
