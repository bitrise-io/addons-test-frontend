import { LogLineLevel } from './log-line-level.model';

export enum Platform {
  ios = 0,
  android = 1,
  unknown = 2
}

// tslint:disable-next-line:max-line-length
export const IOS_LOG_LINE_REGEXP = /^(.*)  ([0-9]{0,2}) ([0-9]{0,2}):([0-9]{0,2}):([0-9]{0,2}) ([^\[]*)\[[0-9]*] <([Notice|Error]*)>: (.*)$/;
// tslint:disable-next-line:max-line-length
export const ANDROID_LOG_LINE_REGEXP = /^([0-9]+)-([0-9]+) ([0-9]+)\:([0-9]+)\:([0-9]+)\.([0-9]+)\: (?:[0-9]+\-[0-9]+\/.+ |)([V|D|I|W|E|A])\/(.+)\([0-9]+\)\: (.+)$/;

export const IosLogLineLevelLookup = {
  Error: LogLineLevel.error,
  Notice: LogLineLevel.info
};

export const AndroidLogLineLevelLookup = {
  A: LogLineLevel.assert,
  E: LogLineLevel.error,
  W: LogLineLevel.warning,
  I: LogLineLevel.info,
  D: LogLineLevel.debug,
  V: LogLineLevel.verbose
};
