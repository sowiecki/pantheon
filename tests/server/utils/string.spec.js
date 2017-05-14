/* eslint-env jest */
import { stringifyObjectValues } from 'utils';

describe('String utilities', () => {
  describe('stringifyObjectValues', () => {
    it('should stringify object values.', () => {
      const expected = { foo: '{"bizz":"bazz"}' };
      const result = stringifyObjectValues({ foo: { bizz: 'bazz' } });

      expect(expected).toEqual(result);
    });
  });
});
