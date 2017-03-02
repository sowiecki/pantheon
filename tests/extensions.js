/* eslint-env jest */
import { isEqual } from 'lodash';

const injectExtensions = () => {
  expect.extend({
    toMatchStructure(received, argument) {
      const pass = isEqual(JSON.stringify(received), JSON.stringify(argument));

      return pass ? {
        pass: true,
        message: () => `expected ${received} not to match the structure of ${argument}`,
      } : {
        pass: false,
        message: () => `expected ${received} to to match the structure of ${argument}`,
      };
    }
  });
};

export default injectExtensions;
