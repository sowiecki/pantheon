/* eslint-env jest */
import { handleEvent, setResponse, getHueStates, formatRequestKeys } from 'utils/services';
import { genMockStore } from 'tests/utils';

import { EMIT_QUEUE_EVENT, RESOLVE_CUSTOM_STATE_UPDATE } from 'ducks/occurrences';

describe('Services utilities', () => {
  describe('handleEvent', () => {
    const mockDispatch = jest.fn();
    const mockStore = genMockStore(mockDispatch);

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should dispatch normal events with the correct action type', async () => {
      const mockEvent = { type: 'EMIT_GENERIC_EVENT' };

      await handleEvent(mockStore, mockEvent);

      expect(mockDispatch.mock.calls.length).toBe(2);
      expect(mockDispatch.mock.calls[0][0].type).toBe('EMIT_GENERIC_EVENT');
      expect(mockDispatch.mock.calls[1][0].type).toBe(RESOLVE_CUSTOM_STATE_UPDATE);
      expect(mockDispatch.mock.calls[2]).toBeUndefined();
    });

    it('should dispatch conditional events with the correct action type', async () => {
      const mockEvent = { type: 'EMIT_GENERIC_EVENT', conditions: { foo: 'bar' } };

      await handleEvent(mockStore, mockEvent);

      expect(mockDispatch.mock.calls.length).toBe(3);
      expect(mockDispatch.mock.calls[0][0].type).toBe('EMIT_GENERIC_EVENT');
      expect(mockDispatch.mock.calls[1][0].type).toBe(RESOLVE_CUSTOM_STATE_UPDATE);
      expect(mockDispatch.mock.calls[2][0].type).toBe(EMIT_QUEUE_EVENT);
    });

    it('should wait to dispatch delayed events', () => {
      const DELAY_TIME = 3000;
      const mockEvent = { type: 'EMIT_GENERIC_EVENT', delay: DELAY_TIME };

      jest.useFakeTimers();

      handleEvent(mockStore, mockEvent);

      expect(setTimeout.mock.calls.length).toBe(1);
      expect(setTimeout.mock.calls[0][1]).toBe(DELAY_TIME);
    });
  });

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
      const result = await getHueStates(genMockStore());

      expect(result).toEqual(expected);
    });
  });

  describe('formatRequestKeys', () => {
    it('should invoke the provided function with all event request arguements converted to camelCase', () => {
      const mockCommand = (a) => ({ ...a });
      const mockAction = { id: 123, snake_case: 'bizz_bazz', FOO_BAR: 0 };
      const mockState = { foo: 'bar', bizz: 'bazz' };
      const expected = { id: 123, snakeCase: 'bizz_bazz', fooBar: 0 };
      const result = formatRequestKeys(mockCommand)(mockAction, mockState);

      expect(result).toEqual(expected);
    });
  });
});
