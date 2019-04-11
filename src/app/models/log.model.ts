import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { Platform } from './platform.model';
import { LogLine, RawLogLine } from './log-line.model';

export type RawLog = string;

@Injectable()
export class Log implements Deserializable {
  lines: LogLine[];

  public static detectPlatform(rawLogLines: RawLogLine[]): Platform {
    const detectedPlatform = [Platform.ios, Platform.android].find(
      (platform: Platform) =>
        rawLogLines.find(
          (rawLogLine: RawLogLine) => LogLine.detectPlatform(rawLogLine) === platform
        ) !== undefined
    );

    return detectedPlatform !== undefined ? detectedPlatform : Platform.unknown;
  }

  deserialize(rawLog: RawLog) {
    const rawLogLines = rawLog.split('\n');
    const detectedPlatform = Log.detectPlatform(rawLogLines);

    this.lines = [];
    rawLogLines.forEach((rawLogLine: RawLogLine) => {
      const logLine = new LogLine();

      if (LogLine.detectPlatform(rawLogLine) === detectedPlatform) {
        logLine.deserialize(rawLogLine);
      } else {
        if (this.lines.length > 0) {
          this.lines[this.lines.length - 1].message += '\n' + rawLogLine;

          return;
        }

        logLine.deserializeUnknown(rawLogLine);
      }

      this.lines.push(logLine);
    });

    return this;
  }
}
