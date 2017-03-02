export const mockGroups = [{ foo: 0 }, { bar: 1 }, { bizz: 2 }, { bazz: 4 }];

export const mockConfig = {
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
