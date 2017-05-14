/* eslint-env jest */
import { map } from 'lodash';

import reducer, {
  EMIT_SEND_HUE_COMMAND,
  EMIT_CUSTOM_STATE_UPDATE,
  EMIT_SAVE_QUEUED_EVENTS,
  EMIT_REGISTER_SPOTIFY_PLAYER,
  EMIT_REGISTER_SPOTIFY_DEVICES,
  EMIT_SPOTIFY_PLAYLISTS_UPDATE
} from 'ducks/occurrences';

describe('Occurrences reducer', () => {
  const handlersMap = {
    [EMIT_CUSTOM_STATE_UPDATE]: { foo: false, action: { path: 'httpRequests.foo', stateUpdates: { bizzBazzKey: true } } },
    [EMIT_REGISTER_SPOTIFY_DEVICES]: { action: { data: {} } },
    [EMIT_REGISTER_SPOTIFY_PLAYER]: { action: { data: {} }, spotifyPlayer: {} },
    [EMIT_SAVE_QUEUED_EVENTS]: { action: {} },
    [EMIT_SEND_HUE_COMMAND]: {
      hue: { userIDs: {} }, action: { ipaddress: '0.0.0.0', func: jest.fn() }
    },
    [EMIT_SPOTIFY_PLAYLISTS_UPDATE]: { action: { data: {} } }
  };

  it('should return the initial state', () => {
    const expected = Object.keys(reducer(undefined, {})).sort();
    const result = Object.keys(handlersMap).sort();

    expect(expected).toEqual(result);
  });

  it('should handle actions', () => {
    map(handlersMap, (mockHandler, type) => {
      const mockReturnState = reducer(mockHandler, {
        type,
        ...mockHandler.action
      })[type];

      const result = mockReturnState();
      const expected = handlersMap[type];

      expect(expected).toEqual(result);
    });
  });
});
