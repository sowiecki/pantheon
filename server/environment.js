/* eslint import/prefer-default-export:0 */
import path from 'path';
import { readFileSync } from 'fs';

import validator from '../environment/validation';

const readFile = (fileName) => {
  const filePath = path.join(__dirname, fileName);

  return JSON.parse(readFileSync(filePath, 'utf8'));
};

const isTest = process.env.NODE_ENV === 'test';
const ENV = isTest ? require('../environment/mock-config') : readFile('../environment/config.json');

if (!isTest) {
  const { errors } = validator.validate(ENV, '/ConfigSchema');

  if (errors.length) {
    errors.forEach((error) => {
      throw new Error(`config.json validation error, ${error.stack}`);
    });
  }
}

export { ENV };
