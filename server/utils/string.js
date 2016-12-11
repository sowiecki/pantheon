/* eslint import/prefer-default-export:0 */

export const getControllerName = (controller) => (
  controller.name.replace(/Controller/, ' controller')
);
