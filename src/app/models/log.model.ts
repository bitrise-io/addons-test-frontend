import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { Platform } from './platform.model';
import { LogLine, LogLineResponse } from './log-line.model';

export type LogResponse = string;

@Injectable()
export class Log implements Deserializable {
  lines: LogLine[];

  public static detectPlatform(logLineResponses: LogLineResponse[]): Platform {
    const detectedPlatform = [Platform.ios, Platform.android].find(
      (platform: Platform) =>
        logLineResponses.find(
          (logLineResponse: LogLineResponse) => LogLine.detectPlatform(logLineResponse) === platform
        ) !== undefined
    );

    return detectedPlatform !== undefined ? detectedPlatform : Platform.unknown;
  }

  deserialize(logResponse: LogResponse) {
    const logLineResponses = logResponse.split('\n');
    const detectedPlatform = Log.detectPlatform(logLineResponses);

    this.lines = [];
    logLineResponses.forEach((logLineResponse: LogLineResponse) => {
      const logLine = new LogLine();

      if (LogLine.detectPlatform(logLineResponse) === detectedPlatform) {
        logLine.deserialize(logLineResponse);
      } else {
        if (this.lines.length > 0) {
          this.lines[this.lines.length - 1].message += '\n' + logLineResponse;

          return;
        }

        logLine.deserializeUnknown(logLineResponse);
      }

      this.lines.push(logLine);
    });

    return this;
  }
}
