import { LogLine } from './log-line.model';
import { LogLineLevel } from './log-line-level.model';
import { Platform } from './platform.model';

describe('LogLine', () => {
  let logLine: LogLine;

  [
    { logLineLevel: LogLineLevel.assert, expectedIconUrl: '/assets/images/sign-cross.svg' },
    { logLineLevel: LogLineLevel.error, expectedIconUrl: '/assets/images/sign-cross.svg' },
    {
      logLineLevel: LogLineLevel.warning,
      expectedIconUrl: '/assets/images/sign-exclamationmark.svg'
    },
    { logLineLevel: LogLineLevel.info, expectedIconUrl: '/assets/images/sign-info.svg' },
    { logLineLevel: LogLineLevel.debug, expectedIconUrl: '/assets/images/bug.svg' },
    { logLineLevel: LogLineLevel.verbose, expectedIconUrl: '/assets/images/bug.svg' }
  ].forEach((specConfig: any) => {
    describe('class method levelIconUrl', () => {
      describe(`when providing level ${specConfig.logLineLevel}`, () => {
        it(`returns icon URL ${specConfig.expectedIconUrl}`, () => {
          expect(LogLine.levelIconUrl(specConfig.logLineLevel)).toBe(specConfig.expectedIconUrl);
        });
      });
    });

    describe('levelIconUrl', () => {
      beforeEach(() => {
        logLine = new LogLine();
      });

      describe(`when test case has level ${specConfig.logLineLevel}`, () => {
        beforeEach(() => {
          logLine.level = specConfig.logLineLevel;
        });

        it(`returns icon URL ${specConfig.expectedIconUrl}`, () => {
          expect(logLine.levelIconUrl).toBe(specConfig.expectedIconUrl);
        });
      });
    });
  });

  describe('detectPlatform', () => {
    [
      {
        platformName: 'iOS',
        rawLogLine:
          'Jan  5 08:00:01 iPhone lockdownd[71] <Notice>: Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        expectedPlatform: Platform.ios
      },
      {
        platformName: 'Android',
        rawLogLine: '01-01 08:00:06.123: D/AndroidRuntime(5): Integer interdum condimentum nisi sed tempor',
        expectedPlatform: Platform.android
      }
    ].forEach((specConfig: any) => {
      describe(`when line is of platform ${specConfig.platformName}`, () => {
        it(`returns platform ${specConfig.expectedPlatform}`, () => {
          expect(LogLine.detectPlatform(specConfig.rawLogLine)).toBe(specConfig.expectedPlatform);
        });
      });
    });

    describe('when line is not matching any of the known platforms', () => {
      it('returns unknown', () => {
        expect(LogLine.detectPlatform('Lorem ipsum dolor sit amet')).toBe(Platform.unknown);
      });
    });
  });

  describe('deserialize', () => {
    beforeEach(() => {
      logLine = new LogLine();
    });

    [
      { platformName: 'iOS', detectPlatformResult: Platform.ios, expectedDeserializerMethod: 'deserializeIos' },
      {
        platformName: 'Android',
        detectPlatformResult: Platform.android,
        expectedDeserializerMethod: 'deserializeAndroid'
      }
    ].forEach(function(specConfig) {
      describe(`when line is detected as platform ${specConfig.platformName}`, () => {
        beforeEach(() => {
          spyOn(LogLine, 'detectPlatform').and.returnValue(specConfig.detectPlatformResult);
          logLine[specConfig.expectedDeserializerMethod] = jasmine
            .createSpy(specConfig.expectedDeserializerMethod)
            .and.callFake(() => {});
        });

        it(`calls ${specConfig.expectedDeserializerMethod}`, () => {
          logLine.deserialize('Lorem ipsum dolor sit amet');

          expect(logLine[specConfig.expectedDeserializerMethod]).toHaveBeenCalledWith('Lorem ipsum dolor sit amet');
        });
      });
    });

    describe('when line is not detected as any of the known platforms', () => {
      beforeEach(() => {
        logLine.deserializeUnknown = jasmine.createSpy('deserializeUnknown').and.callFake(() => {});
      });

      it('calls deserializeUnknown', () => {
        logLine.deserialize('Lorem ipsum dolor sit amet');

        expect(logLine.deserializeUnknown).toHaveBeenCalledWith('Lorem ipsum dolor sit amet');
      });
    });
  });

  [
    {
      method: 'deserializeIos',
      rawLogLine: 'Jan  5 08:00:02 iPhone lockdownd[71] <Notice>: Praesent mollis risus ac orci cursus feugiat',
      expectedLevel: LogLineLevel.info,
      expectedDate: new Date(`2000-01-05 08:00:02`),
      expectedTag: 'iPhone lockdownd',
      expectedMessage: 'Praesent mollis risus ac orci cursus feugiat'
    },
    {
      method: 'deserializeAndroid',
      rawLogLine:
        '01-01 08:00:08.123: D/AndroidRuntime(7): Integer dignissim massa ante, euismod aliquet metus sollicitudin sit amet',
      expectedLevel: LogLineLevel.debug,
      expectedDate: new Date(`2000-01-01 08:00:08:123`),
      expectedTag: 'AndroidRuntime',
      expectedMessage: 'Integer dignissim massa ante, euismod aliquet metus sollicitudin sit amet'
    },
    {
      method: 'deserializeUnknown',
      rawLogLine: 'Lorem ipsum dolor sit amet',
      expectedLevel: null,
      expectedDate: null,
      expectedTag: null,
      expectedMessage: 'Lorem ipsum dolor sit amet'
    }
  ].forEach((specConfig) => {
    describe(specConfig.method, () => {
      beforeEach(() => {
        logLine = new LogLine();
      });

      it(`updates line with proper level, date, tag, message`, () => {
        logLine[specConfig.method](specConfig.rawLogLine);

        expect(logLine.level).toBe(specConfig.expectedLevel);
        expect(logLine.date).toEqual(specConfig.expectedDate);
        expect(logLine.tag).toBe(specConfig.expectedTag);
        expect(logLine.message).toBe(specConfig.expectedMessage);
      });
    });
  });
});
