import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maximizeTo' })
export class MaximizePipe implements PipeTransform {
  transform(value: number, maximumValue: number, maximumReachedPostfixCharacter: string): string {
    if (isNaN(Number(value))) {
      return '';
    }
    if (value <= maximumValue) {
      return String(value);
    }

    return maximumValue + (maximumReachedPostfixCharacter ? maximumReachedPostfixCharacter : '+');
  }
}
