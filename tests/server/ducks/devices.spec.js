/* eslint-env jest */
import { map } from 'lodash';

import reducer, {
  EMIT_REGISTER_BRIDGE,
  EMIT_REGISTER_SPOTIFY_CLIENT,
  EMIT_REGISTER_SPOTIFY_PLAYER,
  EMIT_REGISTER_SPOTIFY_DEVICES,
  EMIT_REGISTER_SPOTIFY_TOKENS,
  EMIT_REGISTER_UNIFIED_ID
} from 'ducks/devices';
import { mockBridge } from 'tests/mocks';

describe('Devices reducer', () => {
  const handlersMap = {
    [EMIT_REGISTER_BRIDGE]: mockBridge,
    [EMIT_REGISTER_SPOTIFY_CLIENT]: {},
    [EMIT_REGISTER_SPOTIFY_DEVICES]: { action: { data: {} } },
    [EMIT_REGISTER_SPOTIFY_PLAYER]: { action: { data: {} }, spotifyPlayer: {} },
    [EMIT_REGISTER_SPOTIFY_TOKENS]: {
      spotifyAccessToken: undefined,
      spotifyRefreshToken: undefined,
      spotifyTokenTimeLeft: '0 minutes',
    },
    [EMIT_REGISTER_UNIFIED_ID]: {}
  };

  it('should return the initial state', () => {
    const expected = Object.keys(reducer(undefined, {})).sort();
    const result = Object.keys(handlersMap).sort();

    expect(expected).toEqual(result);
  });

  map(handlersMap, (mockHandler, type) => {
    const mockReturnState = reducer(mockHandler, {
      type,
      ...mockHandler.action
    })[type];

    const result = mockReturnState();
    const expected = handlersMap[type];

    it(`should handle actions of type ${type}`, () => {
      expect(expected).toEqual(result);
    });
  });
});
