/* globals console */
/* eslint no-console: 0 */
import Particle from 'particle-api-js';

import { setResponse } from 'utils';
import { config } from 'environment';
import { EMIT_SOUND_COM_RESPONSE } from 'ducks/devices';

const particle = new Particle();

const pcOn = (action, next) => {
  setResponse(action, 200);

  const { token } = config.photons.lamprey;
  const secretaryDeviceId = config.photons.secretary.deviceId;

  const options = {
    deviceId: secretaryDeviceId,
    name: action.target,
    argument: action.com,
    auth: token
  };

  particle.callFunction(options).then((data) => {
    console.log(`Function called succesfully on ${data.body.id}`);

    next({
      type: EMIT_SOUND_COM_RESPONSE,
      status: data.body.statusCode
    });
  }, (err) => {
    console.log('An error occurred', err);
  });
};

export default pcOn;
