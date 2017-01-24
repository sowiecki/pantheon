import { EMIT_REGISTER_CUSTOM_STATE } from 'ducks/devices';
import { DEVICE_TYPES } from 'constants';
import store from 'store';

const stateController = () => ({
  initialized() {
    DEVICE_TYPES.forEach((deviceType) => store.dispatch({
      type: EMIT_REGISTER_CUSTOM_STATE,
      deviceType
    }));
  }
});

export default stateController;
