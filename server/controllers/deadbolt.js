import Particle from 'particle-api-js';
import { get } from 'lodash';

import { config } from 'environment';

const particle = new Particle();

export const deadboltController = (next) => ({
  toggle(id = get(next, 'request.header.id')) {
    const { token, deviceId } = config.photons.deadbolt;

    particle.callFunction({
      deviceId,
      auth: token,
      name: 'toggle',
      argument: id
    });
  }
});
