import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { LogLine, LogLineResponse, LogLineType } from './log-line.model';

export enum LogProjectType {
  ios = 0,
  android = 1
}

export type LogResponse = string;

@Injectable()
export class Log implements Deserializable {
  lines: LogLine[];

  deserialize(logResponse: LogResponse) {
    const logProjectType = LogProjectType.android;

    switch (logProjectType) {
      // case LogProjectType.ios:
      //   return this.deserializeIos(logResponse);
      case LogProjectType.android:
        return this.deserializeAndroid(logResponse);
    }
  }

  deserializeIos(logResponse: LogResponse) {
    return this;
  }

  deserializeAndroid(logResponse: LogResponse) {
    this.lines = logResponse.split('\n').map(function(logLineResponse: LogLineResponse) {
      const logLine = new LogLine();

      try {
        const regexp = /^([0-9]+)-([0-9]+) ([0-9]+)\:([0-9]+)\:([0-9]+)\.([0-9]+)\: (?:[0-9]+\-[0-9]+\/.+ |)([V|D|I|W|E|A])\/(.+)\([0-9]+\)\: (.+)$/;

        const month = Number(regexp.exec(logLineResponse)[1]);
        const day = Number(regexp.exec(logLineResponse)[2]);
        const hour = Number(regexp.exec(logLineResponse)[3]);
        const minute = Number(regexp.exec(logLineResponse)[4]);
        const second = Number(regexp.exec(logLineResponse)[5]);
        const millisecond = Number(regexp.exec(logLineResponse)[6]);
        switch (regexp.exec(logLineResponse)[7]) {
          case 'V':
            logLine.type = LogLineType.verbose;

            break;
          case 'D':
            logLine.type = LogLineType.debug;

            break;
          case 'I':
            logLine.type = LogLineType.info;

            break;
          case 'W':
            logLine.type = LogLineType.warning;

            break;
          case 'E':
            logLine.type = LogLineType.error;

            break;
          case 'A':
            logLine.type = LogLineType.assert;

            break;
        }

        logLine.tag = regexp.exec(logLineResponse)[8];
        logLine.message = regexp.exec(logLineResponse)[9];
        logLine.date = new Date(new Date().getFullYear(), month, day, hour, minute, second, millisecond);
      } catch (error) {
        logLine.date = undefined;
        logLine.type = LogLineType.verbose;
        logLine.tag = undefined;
        logLine.message = logLineResponse;
      }

      return logLine;
    });

    return this;
  }
}
