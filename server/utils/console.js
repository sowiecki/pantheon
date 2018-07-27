/* eslint no-console:0, import/prefer-default-export:0 */
import winston from 'winston';
import moment from 'moment';
import colors from 'colors';

export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'events.log',
      timestamp: false,
      maxsize: 100000000,
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'errors.log',
      timestamp: false,
      maxsize: 100000000,
      level: 'error'
    })
  ]
});

const getTime = () => moment().format('M/D/YY hh:mm:ss A');
const withTime = (message) => `${colors.grey(getTime())} | ${message}`;

export const logActionType = (type) => {
  logger.log('info', withTime(colors.yellow(type)));
};

export const logUndefinedHandler = (e) => {
  logger.log('error', withTime(colors.red(e.message)));
};

export const errorNoHandler = (data) => {
  const message = `${colors.red('Unhandled or unauthorized event')}: ${data}`;

  logger.log('error', withTime(message));
};

export const errorLightStatus = (e) => {
  const alert = colors.red('Could not alter light state');
  const message = `${alert}; did you use the correct IP address or trigger a valid function?`;

  logger.log('error', withTime(message));
  if (e) logger.log('error', withTime(e));
};

export const errorNoUserIDFound = (ipaddress) => {
  logger.log('error', `userID not found for Hue bridge on ${ipaddress}`);
};
