/* eslint no-console: 0 */
/* globals console */
import Particle from 'particle-api-js';

import { ENV } from 'config';
import { setResponse } from 'utils';

const particle = new Particle();

const triggerPhotonFunction = (action, next) => {
  const predefinedParameters = ENV.photons[action.key];

  const parameters = {
    ...predefinedParameters,
    ...action
  };

  particle.callFunction(parameters).then((data) => {
    console.log(`Function called succesfully on ${data.body.id}`);

    setResponse(next, 200);
  }, (err) => {
    console.log('An error occurred', err);
  });
};

export default triggerPhotonFunction;
