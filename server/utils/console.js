/* eslint no-console:0, import/prefer-default-export:0 */
import moment from 'moment';
import colors from 'colors';

export const logActionType = (type) => {
  const time = moment().format('M/D/YY hh:mm:ss A');

  console.log(`${colors.grey(time)} | ${colors.yellow(type)}`);
};
