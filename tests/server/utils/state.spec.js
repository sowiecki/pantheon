/* eslint-env jest */
import { handleAction, initCustomState, generateReducers, filterSensativeState } from 'utils/state';

describe('State utilities', () => {
  describe('handleAction', () => {
    it('should reduce the action onto the state.', () => {
      const mockState = { foo: 'bar' };
      const mockAction = { type: 'EMIT_BIZZBAZZ' };
      const mockReducers = { EMIT_BIZZBAZZ: () => mockState.foo };
      const mockHandleAction = handleAction(mockState, mockAction, mockReducers);

      expect(mockHandleAction).toEqual(mockState.foo);
    });
  });

  describe('initCustomState', () => {
    it('should format custom state from user config', () => {
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

  describe('generateReducers', () => {
    it('should generate a single object of reducers from multiple reducers', () => {
      const mockState = {};
      const mockAction = {};

      const fooReducer = (state) => ({ foo: () => state });
      const fizzReducer = (state) => ({ buzz: () => state });
      const bizzReducer = (state) => ({ bazz: () => state });

      const expected = {
        foo: () => mockState,
        buzz: () => mockState,
        bazz: () => mockState
      };
      const result = generateReducers(mockState, mockAction, [
        fooReducer,
        fizzReducer,
        bizzReducer
      ]);
      const resultKeys = Object.keys(result);

      Object.keys(expected).forEach((expectedKey) => {
        const resultValue = result[expectedKey];

        expect(resultValue).toBeTruthy();
        expect(resultKeys).toContain(expectedKey);
      });
    });
  });

  describe('filterSensativeState', () => {
    // TODO test
  });
});
