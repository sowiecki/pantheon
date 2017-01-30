/* eslint-env jest */

import { DEVICE_TYPES } from 'constants/services';
import { formatCustomState } from 'utils/state';

describe('formatCustomState', () => {
  it('Formats custom state from user config', () => {
    const mockCustomState = {
      photons: {
        deadbolt: {
          auth: '123',
          deviceId: '456',
          name: 'mock',
          $state: {
            mockKey: {
              type: 'bool',
              default: true
            }
          }
        }
      },
      httpRequests: {
        foo: {
          options: {
            path: '/api/bar',
            port: 8080,
            hostname: '192.168.1.1'
          },
          $state: {
            mockKey: {
              type: 'bool',
              default: false
            }
          }
        }
      }
    };

    const mockExpected = {
      photons: {
        mockKey: true
      },
      httpRequests: {
        mockKey: false
      }
    };

    DEVICE_TYPES.forEach((DEVICE_TYPE) => {
      const events = mockCustomState[DEVICE_TYPE];
      const result = formatCustomState(events);
      const expected = mockExpected[DEVICE_TYPE];

      expect(result).toEqual(expected);
    });
  });
});
