/* eslint no-console:0, import/prefer-default-export:0 */
import winston from 'winston';
import moment from 'moment';
import colors from 'colors';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      filename: 'events.log',
      timestamp: false,
      maxsize: 100000000
    })
  ]
});

const getTime = () => moment().format('M/D/YY hh:mm:ss A');

export const logActionType = (type) => {
  logger.log('info', `${colors.grey(getTime())} | ${colors.yellow(type)}`);
};

export const logUndefinedHandler = (e) => {
  logger.log('info', `${colors.grey(getTime())} | ${colors.red(e.message)}`);
};

export const errorNoHandler = (event) => {
  logger.log(`${colors.red('Unhandled event')}: ${event}`);
};
