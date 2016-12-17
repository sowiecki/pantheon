import { EMIT_DESK_LIGHT_COLOR_FLASH, EMIT_FORWARD_HTTP_REQUEST } from 'ducks/occurrences';

export const BUZZ = 'BUZZ'; // TODO remove

export const HANDSHAKE = 'HANDSHAKE';
export const RECONNECTED = 'RECONNECTED';
export const FORWARD = 'FORWARD';
export const BATCH_EVENTS = 'BATCH_EVENTS';
export const LIGHTS_COM = 'LIGHTS_COM';
export const LIGHTS_COM_RESPONSE = 'LIGHTS_COM_RESPONSE';
export const SOUND_COM = 'SOUND_COM';
export const SOUND_COM_RESPONSE = 'SOUND_COM_RESPONSE';
export const DEADBOLT_COM = 'DEADBOLT_COM';
export const UNIFIED_BATCH = 'UNIFIED_BATCH';

export const BUZZ_EVENTS = [
  { type: EMIT_DESK_LIGHT_COLOR_FLASH, color: 'green' },
  { type: EMIT_FORWARD_HTTP_REQUEST, key: 'buzz' }
];
