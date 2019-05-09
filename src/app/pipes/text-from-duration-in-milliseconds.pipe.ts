import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textFromDurationInMilliseconds' })
export class TextFromDurationInMilliseconds implements PipeTransform {
  transform(durationInMilliseconds: number): any {
    if (durationInMilliseconds === null) {
      return 'N/A';
    }

    const ONE_SECOND_IN_MILLISECONDS = 1000;
    const ONE_MINUTE_IN_MILLISECONDS = ONE_SECOND_IN_MILLISECONDS * 60;
    const ONE_HOUR_IN_MILLISECONDS = ONE_MINUTE_IN_MILLISECONDS * 60;

    if (durationInMilliseconds >= ONE_HOUR_IN_MILLISECONDS) {
      return `${Math.floor(durationInMilliseconds / ONE_HOUR_IN_MILLISECONDS)} hr`;
    }
    if (durationInMilliseconds >= ONE_MINUTE_IN_MILLISECONDS) {
      return `${Math.floor(durationInMilliseconds / ONE_MINUTE_IN_MILLISECONDS)} min`;
    }
    if (durationInMilliseconds >= ONE_SECOND_IN_MILLISECONDS) {
      return `${Math.floor(durationInMilliseconds / ONE_SECOND_IN_MILLISECONDS)} sec`;
    }

    return `${durationInMilliseconds} ms`;
  }
}
