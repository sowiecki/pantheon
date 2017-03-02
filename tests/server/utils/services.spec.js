/* eslint-env jest */

import { setResponse, getHueStates } from 'utils/services';
import { genMockStore } from 'tests/utils';

describe('Services utilities', () => {
  describe('setResponse', () => {
    it('should safely set a response code', () => {
      const mockAction = { next: { body: null } };

      [200, 403, 404, 500, 503].forEach((code) => {
        setResponse(mockAction, code);

        expect(mockAction.next.body).toEqual(code);
      });
    });
  });

  describe('getHueStates', () => {
    it('should return Hue states', async () => {
      const expected = {
        '192.168.1.0': { foo: 0 },
        '192.168.1.1': { bar: 1 },
        '192.168.1.2': { bizz: 2 },
        '192.168.1.3': { bazz: 4 }
      };
      const result = await getHueStates(genMockStore);

      expect(result).toEqual(expected);
    });
  });
});
