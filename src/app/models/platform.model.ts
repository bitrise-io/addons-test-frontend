export enum Platform {
  ios = 0,
  android = 1,
  unknown = 2
}

// tslint:disable-next-line:max-line-length
export const ANDROID_LOG_LINE_REGEXP = /^([0-9]+)-([0-9]+) ([0-9]+)\:([0-9]+)\:([0-9]+)\.([0-9]+)\: (?:[0-9]+\-[0-9]+\/.+ |)([V|D|I|W|E|A])\/(.+)\([0-9]+\)\: (.+)$/;
// tslint:disable-next-line:max-line-length
export const IOS_LOG_LINE_REGEXP = /^(.*)  ([0-9]{0,2}) ([0-9]{0,2}):([0-9]{0,2}):([0-9]{0,2}) ([^\[]*)\[[0-9]*] <([^>]*)>: (.*)$/;
