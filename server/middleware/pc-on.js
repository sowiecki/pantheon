/* globals console */
/* eslint no-console: 0 */
import { setResponse } from 'utils';
import { config } from 'environment';
import { EMIT_PC_RESPONSE } from 'ducks/devices';

const Particle = require('particle-api-js');
const particle = new Particle();

const pcOn = (action, next) => {
  setResponse(action, 200);

  const { token } = config.photons.lamprey;
  const lampreyDeviceId = config.photons.lamprey.deviceId;
  const secretaryDeviceId = config.photons.secretary.deviceId;

  const particleCallFunction = (callFunction) => {
    particle.callFunction(callFunction).then((data) => {
      console.log(`Function called succesfully on ${data.body.id}`);

      next({
        type: EMIT_PC_RESPONSE,
        status: data.body.statusCode
      });
    }, (err) => {
      console.log('An error occurred', err);
    });
  };

  const functionsToCall = [
    { deviceId: lampreyDeviceId, name: 'pc-power', argument: 'togglePower', auth: token },
    { deviceId: secretaryDeviceId, name: 'pc-sound', argument: 'togglePower', auth: token }
  ];

  functionsToCall.forEach(particleCallFunction);
};

export default pcOn;
