import {
  EMIT_TRIGGER_PHOTON_FUNCTION,
  EMIT_FORWARD_HTTP_REQUEST
} from 'ducks/occurrences';

export const HANDSHAKE = 'HANDSHAKE';
export const RECONNECTED = 'RECONNECTED';
export const FORWARD = 'FORWARD';
export const BATCH_EVENTS = 'BATCH_EVENTS';
export const BATCH_EVENTS_FROM_WEBHOOK = 'BATCH_EVENTS_FROM_WEBHOOK';
export const UNIFIED_BATCH = 'UNIFIED_BATCH';

export const EVENT_EMITTERS_MAP = {
  [EMIT_TRIGGER_PHOTON_FUNCTION]: 'photons',
  [EMIT_FORWARD_HTTP_REQUEST]: 'httpRequests'
};

export const CUSTOM_LIGHT_FUNCTIONS = ['toggle'];
