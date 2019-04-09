import { Log } from './log.model';
import { LogLineType } from './log-line.model';

describe('Log', () => {
  let log: Log;

  describe('deserialize', () => {
    [
      {
        platformName: 'iOS',
        expectedLineCount: 2,
        expectedDate: new Date(`${new Date().getFullYear()}-01-05 08:00:01`),
        expectedType: LogLineType.info,
        fullLog: `Jan  5 08:00:01 iPhone lockdownd[71] <Notice>: Lorem ipsum dolor sit amet, consectetur adipiscing elit
Jan  5 08:00:02 iPhone lockdownd[71] <Notice>: Praesent mollis risus ac orci cursus feugiat`
      },
      {
        platformName: 'Android',
        expectedLineCount: 3,
        expectedDate: new Date(`${new Date().getFullYear()}-01-01 08:0:06:123`),
        expectedType: LogLineType.debug,
        fullLog: `01-01 08:00:06.123: D/AndroidRuntime(5): Integer interdum condimentum nisi sed tempor
01-01 08:00:07.123: D/AndroidRuntime(6): Aliquam erat volutpat
01-01 08:00:08.123: D/AndroidRuntime(7): Integer dignissim massa ante, euismod aliquet metus sollicitudin sit amet`
      }
    ].forEach((specConfig: any) => {
      describe(`when providing log matching ${specConfig.platformName} platform syntax`, () => {
        it(`creates lines, with proper date and type`, () => {
          log = new Log().deserialize(specConfig.fullLog);

          expect(log.lines.length).toBe(specConfig.expectedLineCount);
          expect(log.lines[0].date).toEqual(specConfig.expectedDate);
          expect(log.lines[0].type).toBe(specConfig.expectedType);
        });
      });
    });

    describe('when providing log with syntax matching known platform with only some lines', () => {
      const fullLog = `[connected]
Jan  5 08:00:01 iPhone lockdownd[71] <Notice>: Lorem ipsum dolor sit amet, consectetur adipiscing elit
Jan  5 08:00:02 iPhone lockdownd[71] <Notice>: Praesent mollis risus ac orci cursus feugiat`;

      it('creates lines, with no date, verbose type', () => {
        log = new Log().deserialize(fullLog);

        expect(log.lines.length).toBe(3);
        expect(log.lines[0].date).toBeNull();
        expect(log.lines[0].type).toBe(LogLineType.verbose);
      });
    });

    describe('when providing log with syntax not matching known platforms', () => {
      const fullLog = 'test log line 1\ntest log line 2\ntest log line 3';

      it('creates lines, with no date, no type', () => {
        log = new Log().deserialize(fullLog);

        expect(log.lines.length).toBe(3);
        expect(log.lines[0].date).toBeNull();
        expect(log.lines[0].type).toBeNull();
      });
    });
  });
});
