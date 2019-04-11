import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { Platform, IOS_LOG_LINE_REGEXP, ANDROID_LOG_LINE_REGEXP } from './platform.model';

export enum LogLineLevel {
  assert = 0,
  error = 1,
  warning = 2,
  info = 3,
  debug = 4,
  verbose = 5
}

export type RawLogLine = string;

@Injectable()
export class LogLine implements Deserializable {
  date: Date;
  level: LogLineLevel;
  tag: string;
  message: string;
  isExpanded: false;

  public static levelCssClass(level: LogLineLevel): string {
    const levelCssClasses = {
      [LogLineLevel.assert]: 'assert',
      [LogLineLevel.error]: 'error',
      [LogLineLevel.warning]: 'warning',
      [LogLineLevel.info]: 'info',
      [LogLineLevel.debug]: 'debug',
      [LogLineLevel.verbose]: 'verbose'
    };

    return levelCssClasses[level];
  }

  public static levelIconUrl(level: LogLineLevel): string {
    const levelCssClasses = {
      [LogLineLevel.assert]: '/assets/images/sign-cross.svg',
      [LogLineLevel.error]: '/assets/images/sign-cross.svg',
      [LogLineLevel.warning]: '/assets/images/sign-exclamationmark.svg',
      [LogLineLevel.info]: '/assets/images/sign-info.svg',
      [LogLineLevel.debug]: '/assets/images/bug.svg',
      [LogLineLevel.verbose]: '/assets/images/bug.svg'
    };

    return levelCssClasses[level];
  }

  public static detectPlatform(rawLogLine: RawLogLine): Platform {
    if (IOS_LOG_LINE_REGEXP.test(rawLogLine)) {
      return Platform.ios;
    }
    if (ANDROID_LOG_LINE_REGEXP.test(rawLogLine)) {
      return Platform.android;
    }

    return Platform.unknown;
  }

  get levelCssClass() {
    return LogLine.levelCssClass(this.level);
  }

  get levelIconUrl() {
    return LogLine.levelIconUrl(this.level);
  }

  deserialize(rawLogLine: RawLogLine) {
    try {
      if (LogLine.detectPlatform(rawLogLine) === Platform.ios) {
        return this.deserializeIos(rawLogLine);
      }
      if (LogLine.detectPlatform(rawLogLine) === Platform.android) {
        return this.deserializeAndroid(rawLogLine);
      } else {
        throw new Error(`Unknown platform for log line: ${rawLogLine}`);
      }
    } catch (error) {
      return this.deserializeUnknown(rawLogLine);
    }
  }

  deserializeIos(rawLogLine: RawLogLine) {
    const [_, monthAbbreviation, day, hour, minute, second, tag, iosLogLevel, message] = IOS_LOG_LINE_REGEXP.exec(
      rawLogLine
    );

    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(
      monthAbbreviation
    );
    this.date = new Date(null, month, Number(day), Number(hour), Number(minute), Number(second));

    switch (iosLogLevel) {
      case 'Notice':
        this.level = LogLineLevel.info;

        break;
      case 'Error':
        this.level = LogLineLevel.error;

        break;
      default:
        throw new Error(`Unknown level: ${iosLogLevel}.`);
    }

    this.tag = tag;
    this.message = message;

    return this;
  }

  deserializeAndroid(rawLogLine: RawLogLine) {
    const [
      _,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
      androidLogLevel,
      tag,
      message
    ] = ANDROID_LOG_LINE_REGEXP.exec(rawLogLine);

    this.date = new Date(
      null,
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
      Number(millisecond)
    );

    this.level = ['A', 'E', 'W', 'I', 'D', 'V'].findIndex((levelCharacter) => levelCharacter === androidLogLevel);
    if (this.level === -1) {
      throw Error(`Unknown level: ${androidLogLevel}.`);
    }

    this.tag = tag;
    this.message = message;

    return this;
  }

  deserializeUnknown(rawLogLine: RawLogLine) {
    this.level = null;
    this.date = null;
    this.tag = null;
    this.message = rawLogLine;

    return this;
  }
}
