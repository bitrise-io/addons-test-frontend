import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textFromDurationInMilliseconds' })
export class TextFromDurationInMilliseconds implements PipeTransform {
  transform(durationInMilliseconds: number): any {
    if (durationInMilliseconds >= 1000 * 60 * 60) {
      return `${Math.floor(durationInMilliseconds / 1000 / 60 / 60)} hr`;
    }
    if (durationInMilliseconds >= 1000 * 60) {
      return `${Math.floor(durationInMilliseconds / 1000 / 60)} min`;
    }
    if (durationInMilliseconds >= 1000) {
      return `${Math.floor(durationInMilliseconds / 1000)} sec`;
    }

    return `${durationInMilliseconds} ms`;
  }
}
