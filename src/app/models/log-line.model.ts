import { Injectable } from '@angular/core';

export enum LogLineType {
  assert = 0,
  error = 1,
  warning = 2,
  info = 3,
  debug = 4,
  verbose = 5
}

export type LogLineResponse = string;

@Injectable()
export class LogLine {
  date: Date;
  type: LogLineType;
  tag: string;
  message: string;
  isExpanded: false;

  public static typeCssClass(type: LogLineType): string {
    const typeCssClasses = {
      [LogLineType.assert]: 'assert',
      [LogLineType.error]: 'error',
      [LogLineType.warning]: 'warning',
      [LogLineType.info]: 'info',
      [LogLineType.debug]: 'debug',
      [LogLineType.verbose]: 'verbose'
    };

    return typeCssClasses[type];
  }

  public static typeIconUrl(type: LogLineType): string {
    const typeCssClasses = {
      [LogLineType.assert]: '/assets/images/sign-cross.svg',
      [LogLineType.error]: '/assets/images/sign-cross.svg',
      [LogLineType.warning]: '/assets/images/sign-exclamationmark.svg',
      [LogLineType.info]: '/assets/images/sign-info.svg',
      [LogLineType.debug]: '/assets/images/bug.svg',
      [LogLineType.verbose]: '/assets/images/bug.svg'
    };

    return typeCssClasses[type];
  }

  get typeCssClass() {
    return LogLine.typeCssClass(this.type);
  }

  get typeIconUrl() {
    return LogLine.typeIconUrl(this.type);
  }
}
