/* eslint-env jest */
import { stringifyObjectValues, humanizeDuration } from 'utils';

describe('String utilities', () => {
  describe('stringifyObjectValues', () => {
    it('should stringify object values.', () => {
      const expected = { foo: '{"bizz":"bazz"}' };
      const result = stringifyObjectValues({ foo: { bizz: 'bazz' } });

      expect(expected).toEqual(result);
    });
  });

  describe('humanizeDuration', () => {
    it('should humanize time durations', () => {
      expect('60 minutes').toEqual(humanizeDuration(3600));
      expect('58 minutes').toEqual(humanizeDuration(3500));
      expect('5 minutes').toEqual(humanizeDuration(300));
    });
  });
});
