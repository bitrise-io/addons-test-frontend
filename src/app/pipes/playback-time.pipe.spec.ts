import { PlaybackTimePipe } from './playback-time.pipe';

describe('playbackTime', () => {
  let playbackTime: PlaybackTimePipe;

  beforeEach(() => {
    playbackTime = new PlaybackTimePipe();
  });

  const TESTS = [
    { value: 61, expected: '1:01' },
    { value: 1, expected: '0:01' },
    { value: 120, expected: '2:00' },
    { value: 121, expected: '2:01' },
    { value: 71, expected: '1:11' }
  ];

  for (const test of TESTS) {
    it(`should format ${test.value} into ${test.expected}`, () => {
      expect(playbackTime.transform(test.value)).toBe(test.expected);
    });
  }
});
