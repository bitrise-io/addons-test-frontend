import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { LogLine, LogLineResponse, LogLineType } from './log-line.model';

// tslint:disable-next-line:max-line-length
const IOS_LOG_LINE_REGEXP = /^(.*)  ([0-9]{0,2}) ([0-9]{0,2}):([0-9]{0,2}):([0-9]{0,2}) ([^\[]*)\[[0-9]*] <([^>]*)>: (.*)$/;
// tslint:disable-next-line:max-line-length
const ANDROID_LOG_LINE_REGEXP = /^([0-9]+)-([0-9]+) ([0-9]+)\:([0-9]+)\:([0-9]+)\.([0-9]+)\: (?:[0-9]+\-[0-9]+\/.+ |)([V|D|I|W|E|A])\/(.+)\([0-9]+\)\: (.+)$/;

export enum LogPlatform {
  ios = 0,
  android = 1
}

export type LogResponse = string;

@Injectable()
export class Log implements Deserializable {
  lines: LogLine[];

  deserialize(logResponse: LogResponse) {
    const detectedLogPlatform = [LogPlatform.ios, LogPlatform.android].find(
      (logPlatform: LogPlatform) =>
        logResponse
          .split('\n')
          .find((logLineResponse: LogLineResponse) =>
            [IOS_LOG_LINE_REGEXP, ANDROID_LOG_LINE_REGEXP][logPlatform].test(logLineResponse)
          ) !== undefined
    );

    switch (detectedLogPlatform) {
      case LogPlatform.ios:
        return this.deserializeIos(logResponse);
      case LogPlatform.android:
        return this.deserializeAndroid(logResponse);
      default:
        this.lines = logResponse.split('\n').map((logLineData: string) => {
          const logLine = new LogLine();
          logLine.type = null;
          logLine.date = null;
          logLine.tag = null;
          logLine.message = logLineData;

          return logLine;
        });

        return this;
    }
  }

  deserializeIos(logResponse: LogResponse) {
    this.lines = [];
    logResponse.split('\n').forEach((logLineResponse: LogLineResponse) => {
      const logLine = new LogLine();

      try {
        if (!IOS_LOG_LINE_REGEXP.test(logLineResponse)) {
          if (this.lines.length > 0) {
            this.lines[this.lines.length - 1].message += '\n' + logLineResponse;

            return;
          } else {
            throw Error(`Log line not matching expected pattern: ${logLineResponse}`);
          }
        }

        switch (IOS_LOG_LINE_REGEXP.exec(logLineResponse)[7]) {
          case 'Notice':
            logLine.type = LogLineType.info;

            break;
          case 'Error':
            logLine.type = LogLineType.error;

            break;
          default:
            throw Error(`Log line type unknown: ${IOS_LOG_LINE_REGEXP.exec(logLineResponse)[7]}`);
        }

        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(
          IOS_LOG_LINE_REGEXP.exec(logLineResponse)[1]
        );
        const day = Number(IOS_LOG_LINE_REGEXP.exec(logLineResponse)[2]);
        const hour = Number(IOS_LOG_LINE_REGEXP.exec(logLineResponse)[3]);
        const minute = Number(IOS_LOG_LINE_REGEXP.exec(logLineResponse)[4]);
        const second = Number(IOS_LOG_LINE_REGEXP.exec(logLineResponse)[5]);
        logLine.date = new Date(new Date().getFullYear(), month, day, hour, minute, second);

        logLine.tag = IOS_LOG_LINE_REGEXP.exec(logLineResponse)[6];
        logLine.message = IOS_LOG_LINE_REGEXP.exec(logLineResponse)[8];
      } catch (error) {
        logLine.type = LogLineType.verbose;
        logLine.date = null;
        logLine.tag = null;
        logLine.message = logLineResponse;
      }

      this.lines.push(logLine);
    });

    return this;
  }

  deserializeAndroid(logResponse: LogResponse) {
    this.lines = logResponse.split('\n').map((logLineResponse: LogLineResponse) => {
      const logLine = new LogLine();

      try {
        logLine.type = ['A', 'E', 'W', 'I', 'D', 'V'].findIndex(
          (typeCharacter) => typeCharacter === ANDROID_LOG_LINE_REGEXP.exec(logLineResponse)[7]
        );

        const month = Number(ANDROID_LOG_LINE_REGEXP.exec(logLineResponse)[1]) - 1;
        const day = Number(ANDROID_LOG_LINE_REGEXP.exec(logLineResponse)[2]);
        const hour = Number(ANDROID_LOG_LINE_REGEXP.exec(logLineResponse)[3]);
        const minute = Number(ANDROID_LOG_LINE_REGEXP.exec(logLineResponse)[4]);
        const second = Number(ANDROID_LOG_LINE_REGEXP.exec(logLineResponse)[5]);
        const millisecond = Number(ANDROID_LOG_LINE_REGEXP.exec(logLineResponse)[6]);
        logLine.date = new Date(new Date().getFullYear(), month, day, hour, minute, second, millisecond);

        logLine.tag = ANDROID_LOG_LINE_REGEXP.exec(logLineResponse)[8];
        logLine.message = ANDROID_LOG_LINE_REGEXP.exec(logLineResponse)[9];
      } catch (error) {
        logLine.type = LogLineType.verbose;
        logLine.date = undefined;
        logLine.tag = undefined;
        logLine.message = logLineResponse;
      }

      return logLine;
    });

    return this;
  }
}
