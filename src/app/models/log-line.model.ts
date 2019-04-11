import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { Platform, IOS_LOG_LINE_REGEXP, ANDROID_LOG_LINE_REGEXP } from './platform.model';

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
export class LogLine implements Deserializable {
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

  public static detectPlatform(logLineResponse: LogLineResponse): Platform {
    if (IOS_LOG_LINE_REGEXP.test(logLineResponse)) {
      return Platform.ios;
    }
    if (ANDROID_LOG_LINE_REGEXP.test(logLineResponse)) {
      return Platform.android;
    }

    return Platform.unknown;
  }

  get typeCssClass() {
    return LogLine.typeCssClass(this.type);
  }

  get typeIconUrl() {
    return LogLine.typeIconUrl(this.type);
  }

  deserialize(logLineResponse: LogLineResponse) {
    try {
      if (LogLine.detectPlatform(logLineResponse) === Platform.ios) {
        return this.deserializeIos(logLineResponse);
      }
      if (LogLine.detectPlatform(logLineResponse) === Platform.android) {
        return this.deserializeAndroid(logLineResponse);
      } else {
        throw new Error(`Unknown platform for log line: ${logLineResponse}`);
      }
    } catch (error) {
      return this.deserializeUnknown(logLineResponse);
    }
  }

  deserializeIos(logLineResponse: LogLineResponse) {
    const [_, monthAbbreviation, day, hour, minute, second, tag, iosLogType, message] = IOS_LOG_LINE_REGEXP.exec(
      logLineResponse
    );

    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(
      monthAbbreviation
    );
    this.date = new Date(null, month, Number(day), Number(hour), Number(minute), Number(second));

    switch (iosLogType) {
      case 'Notice':
        this.type = LogLineType.info;

        break;
      case 'Error':
        this.type = LogLineType.error;

        break;
      default:
        throw new Error(`Unknown type: ${iosLogType}.`);
    }

    this.tag = tag;
    this.message = message;

    return this;
  }

  deserializeAndroid(logLineResponse: LogLineResponse) {
    const [
      _,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      androidLogType,
      tag,
      message
    ] = ANDROID_LOG_LINE_REGEXP.exec(logLineResponse);

    this.date = new Date(
      null,
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
      Number(millisecond)
    );

    this.type = ['A', 'E', 'W', 'I', 'D', 'V'].findIndex((typeCharacter) => typeCharacter === androidLogType);
    if (this.type === -1) {
      throw Error(`Unknown type: ${androidLogType}.`);
    }

    this.tag = tag;
    this.message = message;

    return this;
  }

  deserializeUnknown(logLineResponse: LogLineResponse) {
    this.type = null;
    this.date = null;
    this.tag = null;
    this.message = logLineResponse;

    return this;
  }
}
