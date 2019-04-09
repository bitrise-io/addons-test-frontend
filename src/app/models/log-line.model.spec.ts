import { LogLine, LogLineType } from './log-line.model';

describe('LogLine', () => {
  let logLine: LogLine;

  describe('class method typeCssClass', () => {
    [
      { logLineType: LogLineType.assert, expectedCssClass: 'assert' },
      { logLineType: LogLineType.error, expectedCssClass: 'error' },
      { logLineType: LogLineType.warning, expectedCssClass: 'warning' },
      { logLineType: LogLineType.info, expectedCssClass: 'info' },
      { logLineType: LogLineType.debug, expectedCssClass: 'debug' },
      { logLineType: LogLineType.verbose, expectedCssClass: 'verbose' }
    ].forEach((specConfig: any) => {
      describe(`when providing type ${specConfig.logLineType}`, () => {
        it(`returns CSS class ${specConfig.expectedCssClass}`, () => {
          expect(LogLine.typeCssClass(specConfig.logLineType)).toBe(specConfig.expectedCssClass);
        });
      });
    });
  });

  describe('class method typeIconUrl', () => {
    [
      { logLineType: LogLineType.assert, expectedIconUrl: '/assets/images/sign-cross.svg' },
      { logLineType: LogLineType.error, expectedIconUrl: '/assets/images/sign-cross.svg' },
      { logLineType: LogLineType.warning, expectedIconUrl: '/assets/images/sign-exclamationmark.svg' },
      { logLineType: LogLineType.info, expectedIconUrl: '/assets/images/sign-info.svg' },
      { logLineType: LogLineType.debug, expectedIconUrl: '/assets/images/bug.svg' },
      { logLineType: LogLineType.verbose, expectedIconUrl: '/assets/images/bug.svg' }
    ].forEach((specConfig: any) => {
      describe(`when providing type ${specConfig.logLineType}`, () => {
        it(`returns icon URL ${specConfig.expectedIconUrl}`, () => {
          expect(LogLine.typeIconUrl(specConfig.logLineType)).toBe(specConfig.expectedIconUrl);
        });
      });
    });
  });

  describe('typeCssClass', () => {
    beforeEach(() => {
      logLine = new LogLine();
    });

    [
      { logLineType: LogLineType.assert, expectedCssClass: 'assert' },
      { logLineType: LogLineType.error, expectedCssClass: 'error' },
      { logLineType: LogLineType.warning, expectedCssClass: 'warning' },
      { logLineType: LogLineType.info, expectedCssClass: 'info' },
      { logLineType: LogLineType.debug, expectedCssClass: 'debug' },
      { logLineType: LogLineType.verbose, expectedCssClass: 'verbose' }
    ].forEach((specConfig: any) => {
      describe(`when test case has type ${specConfig.logLineType}`, () => {
        beforeEach(() => {
          logLine.type = specConfig.logLineType;
        });

        it(`returns CSS class ${specConfig.expectedCssClass}`, () => {
          expect(logLine.typeCssClass).toBe(specConfig.expectedCssClass);
        });
      });
    });
  });

  describe('typeIconUrl', () => {
    beforeEach(() => {
      logLine = new LogLine();
    });

    [
      { logLineType: LogLineType.assert, expectedIconUrl: '/assets/images/sign-cross.svg' },
      { logLineType: LogLineType.error, expectedIconUrl: '/assets/images/sign-cross.svg' },
      { logLineType: LogLineType.warning, expectedIconUrl: '/assets/images/sign-exclamationmark.svg' },
      { logLineType: LogLineType.info, expectedIconUrl: '/assets/images/sign-info.svg' },
      { logLineType: LogLineType.debug, expectedIconUrl: '/assets/images/bug.svg' },
      { logLineType: LogLineType.verbose, expectedIconUrl: '/assets/images/bug.svg' }
    ].forEach((specConfig: any) => {
      describe(`when test case has type ${specConfig.logLineType}`, () => {
        beforeEach(() => {
          logLine.type = specConfig.logLineType;
        });

        it(`returns icon URL ${specConfig.expectedIconUrl}`, () => {
          expect(logLine.typeIconUrl).toBe(specConfig.expectedIconUrl);
        });
      });
    });
  });
});
