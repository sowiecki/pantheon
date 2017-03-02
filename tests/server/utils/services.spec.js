/* eslint-env jest */

import { setResponse, getHueStates } from 'utils/services';

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
    const mockGroups = [{ foo: 0 }, { bar: 1 }, { bizz: 2 }, { bazz: 4 }];
    const bridgeFactory = (props, index) => ({
      [`192.168.1.${index}`]: {
        bridge: { groups: () => new Promise((resolve) => resolve(mockGroups[index])) }
      }
    });

    const initialMockBridge = bridgeFactory(mockGroups, 0);
    const mockBridges = mockGroups.reduce((accumulated, mockBridge, index) => ({
      ...accumulated,
      ...bridgeFactory(mockBridge, index)
    }), initialMockBridge);

    const mockStore = {
      getState: () => ({
        meta: {
          hue: {
            userIds: ['foo', 'bar'],
            ...mockBridges
          }
        }
      })
    };

    it('should return Hue states', async () => {
      const expected = {
        '192.168.1.0': { foo: 0 },
        '192.168.1.1': { bar: 1 },
        '192.168.1.2': { bizz: 2 },
        '192.168.1.3': { bazz: 4 }
      };
      const result = await getHueStates(mockStore);

      expect(result).toEqual(expected);
    });
  });
});
