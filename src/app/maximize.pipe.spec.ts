import { MaximizePipe } from './maximize.pipe';

describe('Maximize', () => {
  let maximizePipe: MaximizePipe;

  beforeEach(() => {
    maximizePipe = new MaximizePipe();
  });

  describe('when providing non-number value', () => {
    it('returns original value', () => {
      expect(maximizePipe.transform(null, 5)).toBe(null);
      expect(maximizePipe.transform(undefined, 5)).toBe(undefined);
    });
  });

  describe('when providing a smaller value than the maximum', () => {
    it('returns the original value, in a string', () => {
      expect(maximizePipe.transform(3, 5)).toBe('3');
      expect(maximizePipe.transform(-3, 5)).toBe('-3');
      expect(maximizePipe.transform(0, 5)).toBe('0');
      expect(maximizePipe.transform(1000, 5000)).toBe('1000');
    });
  });

  describe('when providing the same value as the maximum', () => {
    it('returns the original value, in a string', () => {
      expect(maximizePipe.transform(5, 5)).toBe('5');
    });
  });

  describe('when providing a bigger value than the maximum', () => {
    describe('and no suffix string is provided', () => {
      it('returns the maximum value suffixed, in a string', () => {
        expect(maximizePipe.transform(6, 5)).toBe('5+');
      });
    });

    describe('and a suffix string is provided', () => {
      it('returns the maximum value suffixed with the specified suffix string, in a string', () => {
        expect(maximizePipe.transform(6, 5, ' or more')).toBe('5 or more');
      });
    });
  });
});
