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

export const logActionType = (type) => {
  const time = moment().format('M/D/YY hh:mm:ss A');

  logger.log('info', `${colors.grey(time)} | ${colors.yellow(type)}`);
};
