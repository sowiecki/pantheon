/* eslint import/prefer-default-export:0 */
import { mapValues } from 'lodash';

export const stringifyObjectValues = (headers) => mapValues(headers, (header) => {
  if (typeof header !== 'string') {
    return JSON.stringify(header);
  }

  return header;
});
