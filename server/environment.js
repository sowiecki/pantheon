/* eslint array-callback-return:0 */
import path from 'path';
import { readFileSync } from 'fs';

const readFile = (fileName) => {
  const filePath = path.join('./environment', fileName);

  return JSON.parse(readFileSync(filePath, 'utf8'));
};

/**
 * Reads user-configured JSON environment files.
 *
 * @returns {object} config
 */
const getEnvironment = () => ({
  config: readFile('../environment/config.json')
});

export const { config } = getEnvironment();
