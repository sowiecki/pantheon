/* eslint-env jest */

import { initCustomState } from 'utils/state';

describe('initCustomState', () => {
  it('Formats custom state from user config', () => {
    const mockConfig = {
      photons: {
        deadbolt: {
          auth: '123',
          deviceId: '456',
          name: 'mock',
          $state: {
            fooBarKey: {
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
            bizzBazzKey: {
              type: 'bool',
              default: false
            }
          }
        }
      }
    };

    const expected = {
      bizzBazzKey: {
        default: false,
        type: 'bool',
      },
      fooBarKey: {
        default: true,
        type: 'bool',
      }
    };

    const result = initCustomState(mockConfig);

    expect(result).toEqual(expected);
  });
});
