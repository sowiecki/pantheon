/* eslint import/prefer-default-export:0 */
import path from 'path';
import { readFileSync } from 'fs';

import validator from '../environment/validation';

const readFile = (fileName) => {
  const filePath = path.join(__dirname, fileName);

  return JSON.parse(readFileSync(filePath, 'utf8'));
};

const config = readFile('../environment/config.json');

const { errors } = validator.validate(config, '/ConfigSchema');

if (errors.length) {
  errors.forEach((error) => {
    throw new Error(`config.json validation error, ${error.stack}`);
  });
}

export { config };
