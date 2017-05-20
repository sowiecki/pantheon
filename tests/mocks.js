export const mockGroups = [{ foo: 0 }, { bar: 1 }, { bizz: 2 }, { bazz: 4 }];

export const mockConfig = {
  id: 'foo',
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
          default: false,
          $handler: '(value) => value'
        }
      }
    }
  }
};

export const mockBridge = {
  action: {
    bridge: { ipaddress: '0.0.0.0' }
  },
  hue: {
    '0.0.0.0': {
      bridge: {
        _config: {
          hostname: '0.0.0.0', port: 80, timeout: 10000, username: undefined
        }
      },
      userID: undefined
    },
    bridge: {
      '0.0.0.0': {
        _config: {
          hostname: '0.0.0.0', port: 80, timeout: 10000, username: undefined
        }
      }
    },
    userIDs: {}
  }
};
