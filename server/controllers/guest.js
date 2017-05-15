import { ENV } from 'config';
import store from 'store';
import proxyController from './proxy';
import Controller from './controller';
import { throttle } from 'lodash';

const guestController = {
  displayName: 'Guest Controller',

  shouldInit: () => !!ENV.guest,

  initialize() {
    const manageGuestProxy = () => {
      const { guestEnabled } = store.getState().meta;

      if (guestEnabled && !this.alreadyEnabled) {
        console.log('Creating proxy controller');
        this.guestProxy = new Controller(proxyController);
        this.guestProxy.initialize(ENV.guest.id);

        this.alreadyEnabled = true;
      } else if (!guestEnabled && this.alreadyEnabled) {
        console.log('Destroying proxy controller');
        this.guestProxy.terminate();

        this.alreadyEnabled = false;
      }
    };

    store.subscribe(manageGuestProxy);
  }
};

export default guestController;
