import { Log } from './log.model';
import { Platform } from './platform.model';
import { LogLine } from './log-line.model';

describe('Log', () => {
  let log: Log;

  describe('class method detectPlatform', () => {
    [{ platformName: 'iOS', platform: Platform.ios }, { platformName: 'Android', platform: Platform.android }].forEach(
      (specConfig) => {
        describe(`when all log line responses matches platform ${specConfig.platformName}`, () => {
          beforeEach(() => {
            spyOn(LogLine, 'detectPlatform').and.returnValue(Platform.ios);
          });

          it(`detects ${specConfig.platformName}`, () => {
            expect(Log.detectPlatform(['matching log line', 'matching log line'])).toBe(Platform.ios);
          });
        });

        describe(`when some log line responses matches platform ${specConfig.platformName}`, () => {
          beforeEach(() => {
            spyOn(LogLine, 'detectPlatform').and.callFake((logLineResponse) =>
              logLineResponse === 'matching log line' ? Platform.ios : Platform.unknown
            );
          });

          it(`detects ${specConfig.platformName}`, () => {
            expect(Log.detectPlatform(['matching log line', 'not matching log line'])).toBe(Platform.ios);
          });
        });
      }
    );

    describe('when no log line responses match any platform', () => {
      beforeEach(() => {
        spyOn(LogLine, 'detectPlatform').and.returnValue(Platform.unknown);
      });

      it(`detects unknown platform`, () => {
        expect(Log.detectPlatform(['not matching log line', 'not matching log line'])).toBe(Platform.unknown);
      });
    });
  });

  describe('deserialize', () => {
    let logResponse;

    beforeEach(() => {
      log = new Log();
      spyOn(Log, 'detectPlatform').and.returnValue(Platform.android);
      spyOn(LogLine, 'detectPlatform').and.callFake(function(logLineResponse) {
        return logLineResponse === 'matching log line' ? Platform.android : Platform.unknown;
      });
      spyOn(LogLine.prototype, 'deserialize').and.callFake(function(logLineResponse) {
        this.message =
          logLineResponse === 'matching log line' ? `android: ${logLineResponse}` : `unknown: ${logLineResponse}`;
      });
      spyOn(LogLine.prototype, 'deserializeUnknown').and.callFake(function(logLineResponse) {
        this.message = `unknown: ${logLineResponse}`;
      });
    });

    describe('when all log line responses match detected platform', () => {
      beforeEach(() => {
        logResponse = 'matching log line\nmatching log line\nmatching log line';
      });

      it('creates as many lines, each with matching platform deserialization', () => {
        log.deserialize(logResponse);
        expect(log.lines.length).toBe(3);
        expect(log.lines[0].message).toBe('android: matching log line');
        expect(log.lines[1].message).toBe('android: matching log line');
        expect(log.lines[2].message).toBe('android: matching log line');
      });
    });

    describe('when first log line response does not match detected platform', () => {
      beforeEach(() => {
        logResponse = 'not matching log line\nmatching log line\nmatching log line';
      });

      it('creates as many lines, first line with unknown platform deserialization', () => {
        log.deserialize(logResponse);
        expect(log.lines.length).toBe(3);
        expect(log.lines[0].message).toBe('unknown: not matching log line');
        expect(log.lines[1].message).toBe('android: matching log line');
        expect(log.lines[2].message).toBe('android: matching log line');
      });
    });

    describe('when a later log line response does not match detected platform', () => {
      describe('and that log line is not the first line', () => {
        beforeEach(() => {
          logResponse = 'matching log line\nnot matching log line\nmatching log line';
        });

        it('merges that line with the previous line', () => {
          log.deserialize(logResponse);
          expect(log.lines.length).toBe(2);
          expect(log.lines[0].message).toBe('android: matching log line\nnot matching log line');
          expect(log.lines[1].message).toBe('android: matching log line');
        });
      });
    });
  });
});
