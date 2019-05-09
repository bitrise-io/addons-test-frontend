import { TextFromDurationInMilliseconds } from './text-from-duration-in-milliseconds.pipe';

describe('TextFromDurationInMilliseconds', () => {
  let textFromDurationInMilliseconds: TextFromDurationInMilliseconds;

  beforeEach(() => {
    textFromDurationInMilliseconds = new TextFromDurationInMilliseconds();
  });

  [
    { milliseconds: null, expectedText: 'N/A' },
    { milliseconds: 2, expectedText: '2 ms' },
    { milliseconds: 1000, expectedText: '1 sec' },
    { milliseconds: 2000, expectedText: '2 sec' },
    { milliseconds: 2002, expectedText: '2 sec' },
    { milliseconds: 60000, expectedText: '1 min' },
    { milliseconds: 62002, expectedText: '1 min' },
    { milliseconds: 62000, expectedText: '1 min' },
    { milliseconds: 62002, expectedText: '1 min' },
    { milliseconds: 120000, expectedText: '2 min' },
    { milliseconds: 122002, expectedText: '2 min' },
    { milliseconds: 122000, expectedText: '2 min' },
    { milliseconds: 122002, expectedText: '2 min' },
    { milliseconds: 3600000, expectedText: '1 hr' },
    { milliseconds: 3600002, expectedText: '1 hr' },
    { milliseconds: 3602000, expectedText: '1 hr' },
    { milliseconds: 3602002, expectedText: '1 hr' },
    { milliseconds: 3720000, expectedText: '1 hr' },
    { milliseconds: 3720002, expectedText: '1 hr' },
    { milliseconds: 3722000, expectedText: '1 hr' },
    { milliseconds: 3722002, expectedText: '1 hr' },
    { milliseconds: 7200000, expectedText: '2 hr' },
    { milliseconds: 7200002, expectedText: '2 hr' },
    { milliseconds: 7202000, expectedText: '2 hr' },
    { milliseconds: 7202002, expectedText: '2 hr' },
    { milliseconds: 7320000, expectedText: '2 hr' },
    { milliseconds: 7320002, expectedText: '2 hr' },
    { milliseconds: 7322000, expectedText: '2 hr' },
    { milliseconds: 7322002, expectedText: '2 hr' }
  ].forEach((specConfig: any) => {
    describe(`when ${specConfig.milliseconds} milliseconds is passed`, () => {
      it(`returns ${specConfig.expectedText}`, () => {
        expect(textFromDurationInMilliseconds.transform(specConfig.milliseconds)).toBe(specConfig.expectedText);
      });
    });
  });
});
