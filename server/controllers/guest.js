import { get } from 'lodash';

import { ENV } from 'config';
import store from 'store';
import proxyController from './proxy';
import Controller from './controller';

const guestController = {
  displayName: 'Guest Controller',

  shouldInit: () => !!ENV.guest,

  initialize() {
    const manageGuestProxy = () => {
      const { guestEnabled } = store.getState().meta;
      if (guestEnabled && this.guestProxy) {
        this.guestProxyController = new Controller(proxyController);
        this.guestProxyController.initialize(ENV.guest.id);
      } else if (!guestEnabled) {
        if (get(this, 'guestProxyController.terminate')) {
          this.guestProxyController.terminate();
        }

        delete this.guestProxyController;
      }
    };

    store.subscribe(manageGuestProxy);
  }
};

export default guestController;
