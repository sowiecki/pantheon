/**
 * Safetly sets HTTP response, if possible.
 * TODO: Send response to webSocket proxy when possible.
 */
export const setResponse = (action, code) => {
  if (action && action.next) {
    action.next.body = code;
  }
};
