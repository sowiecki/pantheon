import { mapValues } from 'lodash';
import moment from 'moment';

export const stringifyObjectValues = (headers) => mapValues(headers, (header) => {
  if (typeof header !== 'string') {
    return JSON.stringify(header);
  }

  return header;
});

export const humanizeDuration = (duration, unit = 's') => `${Math.floor(moment.duration(duration, unit).asMinutes())} minutes`;
