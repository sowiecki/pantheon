/* eslint-env jest */
import { setResponse } from 'utils/services';

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
});
