import { EMIT_CUSTOM_STATE_REGISTER } from 'ducks/devices';
import { EMIT_CUSTOM_STATE_UPDATE } from 'ducks/occurrences';
import { DEVICE_TYPES } from 'constants';
import store from 'store';

const stateController = () => ({
  initialize() {
    DEVICE_TYPES.forEach((deviceType) => store.dispatch({
      type: EMIT_CUSTOM_STATE_REGISTER,
      deviceType
    }));
  },

  update(newCustomState) {
    store.dispatch({
      type: EMIT_CUSTOM_STATE_UPDATE,
      newCustomState
    });
  }
});

export default stateController;
