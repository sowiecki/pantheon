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

      if (guestEnabled && !this.alreadyEnabled) {
        this.guestProxy = new Controller(proxyController);
        this.guestProxy.initialize(ENV.guest.id);

        this.alreadyEnabled = true;
      } else if (!guestEnabled && this.alreadyEnabled) {
        this.guestProxy.terminate();

        this.alreadyEnabled = false;
      }
    };

    store.subscribe(manageGuestProxy);
  }
};

export default guestController;
