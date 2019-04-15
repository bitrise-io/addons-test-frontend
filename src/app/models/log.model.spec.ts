import { Log } from './log.model';
import { Platform } from './platform.model';
import { LogLine } from './log-line.model';

describe('Log', () => {
  let log: Log;

  describe('class method detectPlatform', () => {
    [{ platformName: 'iOS', platform: Platform.ios }, { platformName: 'Android', platform: Platform.android }].forEach(
      (specConfig) => {
        describe(`when all raw log lines matches platform ${specConfig.platformName}`, () => {
          beforeEach(() => {
            spyOn(LogLine, 'detectPlatform').and.returnValue(Platform.ios);
          });

          it(`detects ${specConfig.platformName}`, () => {
            expect(Log.detectPlatform(['matching log line', 'matching log line'])).toBe(Platform.ios);
          });
        });

        describe(`when some raw log lines matches platform ${specConfig.platformName}`, () => {
          beforeEach(() => {
            spyOn(LogLine, 'detectPlatform').and.callFake((rawLogLine) =>
              rawLogLine === 'matching log line' ? Platform.ios : Platform.unknown
            );
          });

          it(`detects ${specConfig.platformName}`, () => {
            expect(Log.detectPlatform(['matching log line', 'not matching log line'])).toBe(Platform.ios);
          });
        });
      }
    );

    describe('when no raw log lines match any platform', () => {
      beforeEach(() => {
        spyOn(LogLine, 'detectPlatform').and.returnValue(Platform.unknown);
      });

      it(`detects unknown platform`, () => {
        expect(Log.detectPlatform(['not matching log line', 'not matching log line'])).toBe(Platform.unknown);
      });
    });
  });

  describe('deserialize', () => {
    let rawLog;

    beforeEach(() => {
      log = new Log();
      spyOn(Log, 'detectPlatform').and.returnValue(Platform.android);
      spyOn(LogLine, 'detectPlatform').and.callFake(function(rawLogLine) {
        return rawLogLine === 'matching log line' ? Platform.android : Platform.unknown;
      });
      spyOn(LogLine.prototype, 'deserialize').and.callFake(function(rawLogLine) {
        this.message =
          rawLogLine === 'matching log line' ? `android: ${rawLogLine}` : `unknown: ${rawLogLine}`;
      });
      spyOn(LogLine.prototype, 'deserializeUnknown').and.callFake(function(rawLogLine) {
        this.message = `unknown: ${rawLogLine}`;
      });
    });

    describe('when all raw log lines match detected platform', () => {
      beforeEach(() => {
        rawLog = 'matching log line\nmatching log line\nmatching log line';
      });

      it('creates as many lines, each with matching platform deserialization', () => {
        log.deserialize(rawLog);
        expect(log.lines.length).toBe(3);
        expect(log.lines[0].message).toBe('android: matching log line');
        expect(log.lines[1].message).toBe('android: matching log line');
        expect(log.lines[2].message).toBe('android: matching log line');
      });
    });

    describe('when first raw log line does not match detected platform', () => {
      beforeEach(() => {
        rawLog = 'not matching log line\nmatching log line\nmatching log line';
      });

      it('creates as many lines, first line with unknown platform deserialization', () => {
        log.deserialize(rawLog);
        expect(log.lines.length).toBe(3);
        expect(log.lines[0].message).toBe('unknown: not matching log line');
        expect(log.lines[1].message).toBe('android: matching log line');
        expect(log.lines[2].message).toBe('android: matching log line');
      });
    });

    describe('when a later raw log line does not match detected platform', () => {
      describe('and that log line is not the first line', () => {
        beforeEach(() => {
          rawLog = 'matching log line\nnot matching log line\nmatching log line';
        });

        it('merges that line with the previous line', () => {
          log.deserialize(rawLog);
          expect(log.lines.length).toBe(2);
          expect(log.lines[0].message).toBe('android: matching log line\nnot matching log line');
          expect(log.lines[1].message).toBe('android: matching log line');
        });
      });
    });
  });
});
