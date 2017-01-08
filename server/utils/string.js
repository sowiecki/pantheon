import { mapValues } from 'lodash';

export const getControllerName = (controller) => (
  controller.name.replace(/Controller/, ' controller')
);

export const stringifyObjectValues = (headers) => mapValues(headers, (header) => {
  if (typeof header !== 'string') {
    return JSON.stringify(header);
  }

  return header;
});
