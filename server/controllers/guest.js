import { get } from 'lodash';

import { ENV } from 'config';
import { GUEST_ACCESS_REVOKE_INTERVAL } from 'constants';
import store from 'store';
import proxyController from './proxy';
import Controller from './controller';

const guestController = {
  displayName: 'Guest Controller',

  shouldInit: () => !!ENV.guest.id && !!ENV.guest.password,

  initialize() {
    const manageGuestProxy = () => {
      const { guestEnabled } = store.getState().meta;

      if (guestEnabled && this.guestProxy) {
        this.guestProxyController = new Controller(proxyController);
        this.guestProxyController.initialize(ENV.guest.id, ENV.guest.password);

        if (!ENV.guest.indefinite) {
          setInterval(this.terminate, GUEST_ACCESS_REVOKE_INTERVAL);
        }
      } else if (!guestEnabled) {
        this.terminate();
      }
    };

    this.storeListener = store.subscribe(manageGuestProxy);
  },

  terminate() {
    if (get(this, 'guestProxyController.terminate')) {
      this.guestProxyController.terminate();
    }

    delete this.guestProxyController;
  }
};

export default guestController;
