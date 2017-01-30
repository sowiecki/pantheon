import { EMIT_CUSTOM_STATE_REGISTER } from 'ducks/devices';
import { DEVICE_TYPES } from 'constants';
import store from 'store';

const stateController = () => ({
  initialize() {
    DEVICE_TYPES.forEach((deviceType) => store.dispatch({
      type: EMIT_CUSTOM_STATE_REGISTER,
      deviceType
    }));
  }
});

export default stateController;
