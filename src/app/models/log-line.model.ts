import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import {
  Platform,
  IOS_LOG_LINE_REGEXP,
  ANDROID_LOG_LINE_REGEXP,
  AndroidLogLineLevelLookup,
  IosLogLineLevelLookup
} from './platform.model';

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
    const detectedPlatform = LogLine.detectPlatform(rawLogLine);
    if (detectedPlatform === Platform.ios) {
      return this.deserializeIos(rawLogLine);
    } else if (detectedPlatform === Platform.android) {
      return this.deserializeAndroid(rawLogLine);
    } else {
      return this.deserializeUnknown(rawLogLine);
    }
  }

  deserializeIos(rawLogLine: RawLogLine) {
    const [_, month, day, hour, minute, second, tag, iosLogLevel, message] = IOS_LOG_LINE_REGEXP.exec(
      rawLogLine
    );
    this.date = new Date(`2000 ${month} ${day} ${hour}:${minute}:${second}`);
    this.level = IosLogLineLevelLookup[iosLogLevel];
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

    this.date = new Date(`2000-${month}-${day} ${hour}:${minute}:${second}:${millisecond}`);
    this.level = AndroidLogLineLevelLookup[androidLogLevel];
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
