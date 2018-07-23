export default [
  {
    id: '/ConfigSchema',
    title: 'Config Schema',
    type: 'object',
    properties: {
      id: { type: 'string' },
      password: { type: 'string' },
      allowUnsecuredLAN: { type: 'boolean' },
      proxyHost: { type: 'string' },
      guest: {
        type: 'object',
        properties: {
          indefinite: { type: 'boolean' },
          password: { type: 'string' },
          allowedEvents: { type: 'array' }
        }
      },
      hueUserIDs: {
        type: 'object',
        properties: {
          additionalProperties: { type: 'string' }
        }
      },
      photons: {
        type: 'object',
        additionalProperties: {
          $ref: '/PhotonSchema'
        }
      },
      httpRequests: {
        type: 'object',
        additionalProperties: {
          $ref: '/HttpRequestSchema'
        }
      },
      unified: {
        type: 'object',
        properties: {
          hostname: { type: 'string' }
        },
        required: ['hostname']
      }
    },
    required: ['id', 'password']
  },

  {
    id: '/PhotonSchema',
    type: 'object',
    properties: {
      auth: { type: 'string' },
      deviceId: { type: 'string' },
      name: { type: 'string' },
      argument: { type: 'string' }
    },
    required: ['auth', 'deviceId']
  },

  {
    id: '/HttpRequestSchema',
    type: 'object',
    properties: {
      options: {
        properties: {
          path: { type: 'string' },
          port: { type: 'number' },
          hostname: { type: 'string' }
        },
        required: ['path', 'hostname']
      },
      body: {
        type: 'string'
      }
    },
    required: ['options']
  }
];
